<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="chat-header">
        <div class="header-info">
          <h2>{{ text[lang].title }}</h2>
          <p class="status">{{ text[lang].support }} • Online</p>
        </div>
        <button class="clear-btn" @click="clearHistory">{{ text[lang].clearBtn }}</button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="message assistant">
          {{ text[lang].welcome }}
        </div>

        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          {{ msg.content }}
        </div>

        <div v-if="isLoading" class="message assistant typing">{{ text[lang].thinking }}</div>
      </div>

      <div class="input-area-wrapper">
        <div class="quick-hints">
          <button @click="sendMessage(text[lang].hint1)">{{ text[lang].hint1 }}</button>
          <button @click="sendMessage(text[lang].hint2)">{{ text[lang].hint2 }}</button>
        </div>

        <div v-if="selectedFile" class="file-badge">
          📎 {{ selectedFile.name }}
          <button @click="selectedFile = null">✕</button>
        </div>

        <div class="chat-box">
          <input type="file" ref="fileInput" style="display: none" @change="onFileSelected" />
          <button class="attach-btn" @click="fileInput.click()">📎</button>
          
          <input
            v-model="userInput" 
            :placeholder="text[lang].placeholder"
            @keyup.enter="handleSend"
          />
          <button class="send-btn" @click="handleSend" :disabled="isLoading">
            <span v-if="!isLoading">➤</span>
            <span v-else>...</span>
          </button>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import BottomNav from '@/components/BottomNav.vue'
import api from '@/services/api'
import { useLang } from '@/composables/useLang' // ПОДКЛЮЧАЕМ ЯЗЫК

const { lang } = useLang() // ДОСТАЕМ ТЕКУЩИЙ ЯЗЫК

const sidebarOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

const fileInput = ref(null)
const selectedFile = ref(null)

// СЛОВАРЬ ПЕРЕВОДОВ ДЛЯ ЧАТА
const text = {
  ru: {
    title: 'ИИ-Помощник AURA',
    support: 'Техническая поддержка',
    clearBtn: 'Очистить историю',
    welcome: 'Здравствуйте! Я ИИ-помощник академического портала. Можете загрузить документ или задать вопрос.',
    thinking: 'AURA думает...',
    hint1: 'Объяснить тему',
    hint2: 'Проверить решение',
    placeholder: 'Введите ваш вопрос...',
    confirmClear: 'Очистить историю?'
  },
  kk: {
    title: 'ЖИ-Көмекші AURA',
    support: 'Техникалық қолдау',
    clearBtn: 'Тарихты тазарту',
    welcome: 'Сәлеметсіз бе! Мен академиялық порталдың ЖИ-көмекшісімін. Құжатты жүктей аласыз немесе сұрақ қоя аласыз.',
    thinking: 'AURA ойлануда...',
    hint1: 'Тақырыпты түсіндіру',
    hint2: 'Шешімді тексеру',
    placeholder: 'Сұрағыңызды енгізіңіз...',
    confirmClear: 'Тарихты тазарту керек пе?'
  },
  en: {
    title: 'AI Assistant AURA',
    support: 'Technical Support',
    clearBtn: 'Clear history',
    welcome: 'Hello! I am the academic portal AI assistant. You can upload a document or ask a question.',
    thinking: 'AURA is thinking...',
    hint1: 'Explain topic',
    hint2: 'Check solution',
    placeholder: 'Enter your question...',
    confirmClear: 'Clear history?'
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/ai/history')
    messages.value = res.data
    scrollToBottom()
  } catch (e) { console.error('Ошибка истории') }
})

const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0]
}

const handleSend = () => sendMessage()

const sendMessage = async (textMsg) => {
  const messageText = textMsg || userInput.value
  if ((!messageText || !messageText.trim()) && !selectedFile.value) return

  isLoading.value = true
  let finalContent = messageText

  if (selectedFile.value) {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    try {
      const uploadRes = await api.post('/ai/upload', formData)
      finalContent += `\n[Файл: ${uploadRes.data.name}]`
    } catch (e) { alert('Ошибка загрузки') }
  }

  messages.value.push({ role: 'user', content: finalContent })
  userInput.value = ''
  selectedFile.value = null
  scrollToBottom()

  try {
    const res = await api.post('/ai/chat', { message: finalContent })
    messages.value.push({ role: 'assistant', content: res.data.reply })
  } catch (e) {
    messages.value.push({ role: 'assistant', content: 'Ошибка связи.' })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const clearHistory = async () => {
  // Используем перевод для алерта (lang.value, так как это внутри JS кода)
  if (confirm(text[lang.value].confirmClear)) {
    await api.delete('/ai/history')
    messages.value = []
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f1f5f9;
  padding-bottom: 70px;
}

.content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100vh - 420px);
  overflow-y: auto;
  padding: 10px;
}

.message {
  max-width: 80%;
  padding: 14px 20px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.5;
}

.message.user {
  align-self: flex-end;
  background: #4f7cff;
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(79, 124, 255, 0.2);
}

.message.assistant {
  align-self: flex-start;
  background: white;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

/* ФИКСИРОВАННЫЙ КОНТЕЙНЕР ВВОДА */
.input-area-wrapper {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 100;
}

.quick-hints {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  overflow-x: auto;
}

.quick-hints button {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
}

.file-badge {
  background: #ebf2ff;
  color: #4f7cff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  display: inline-flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 10px 8px 18px;
  border-radius: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.chat-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
}

/* ТА САМАЯ СИНЯЯ КНОПКА */
.send-btn {
  background: #4f7cff;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(79, 124, 255, 0.3);
}

.send-btn:hover {
  background: #3b66f5;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.attach-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #94a3b8;
  cursor: pointer;
}

.clear-btn {
  background: #fff5f5;
  color: #f56565;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
}
</style>