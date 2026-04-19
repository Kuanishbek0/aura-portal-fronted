<template>
  <nav class="bottom-nav">
    <button :class="{ active: route.path === '/home' || route.path === '/' }" @click="router.push('/home')">
      {{ text[lang].home }}
    </button>

    <button :class="{ active: route.path === '/ai' }" @click="router.push('/ai')">
      {{ text[lang].ai }}
    </button>

    <button :class="{ active: route.path === '/performance' }" @click="router.push('/performance')">
      {{ text[lang].performance }}
    </button>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useLang } from '@/composables/useLang' // Подключаем глобальный язык

const router = useRouter()
const route = useRoute()
const { lang } = useLang()

// Словарь для нижней панели
const text = {
  ru: {
    home: 'Главная',
    ai: 'ИИ-Помощник',
    performance: 'Успеваемость'
  },
  kk: {
    home: 'Басты бет',
    ai: 'ЖИ-Көмекші',
    performance: 'Үлгерім'
  },
  en: {
    home: 'Home',
    ai: 'AI Assistant',
    performance: 'Performance'
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px; /* БЫЛО 74px, СТАЛО 56px */
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.02); /* Легкая тень сверху для объема */
  z-index: 100;
}

.bottom-nav button {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px; /* Чуть уменьшили текст */
  font-weight: 600;
  color: #64748b; /* Неактивные кнопки теперь серого цвета */
  cursor: pointer;
  transition: all 0.2s;
}

/* Эффект при наведении мыши (для ПК) */
.bottom-nav button:hover {
  background: #f8fafc;
  color: #4f7cff;
}

.bottom-nav button.active {
  background: #4f7cff;
  color: white;
  border-radius: 12px 12px 0 0; /* Немного сгладили углы пропорционально новой высоте */
}
</style>