<template>
  <header class="header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">☰</button>
      <h1 class="title">Академический портал</h1>
    </div>

    <div class="header-right">
      
      <div class="header-actions">
        <div class="lang-switcher">
          <span :class="{ active: lang === 'kk' }" @click="lang = 'kk'">KZ</span>
          <span class="divider">|</span>
          <span :class="{ active: lang === 'ru' }" @click="lang = 'ru'">RU</span>
          <span class="divider">|</span>
          <span :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</span>
        </div>

        <div class="icon-group">
          <button class="icon-btn theme-toggle" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Темная тема'">
            {{ isDark ? '☀️' : '🌙' }}
          </button>

          <button class="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 100 8 4 4 0 000-8zM6 22v-4a4 4 0 014-4h4a4 4 0 014 4v4"/></svg>
          </button>
          <button class="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button class="icon-btn notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span class="badge">15653</span>
          </button>
        </div>
      </div>

      <div class="header-clock">{{ currentTime }}</div>

      <div class="user-profile" v-if="user" @click="router.push('/profile')">
        <div class="user-info">
          <span class="name">{{ user.name.split(' ')[0] }}</span> 
          <span class="group">{{ user.group || 'Студент' }}</span>
        </div>
        <div class="avatar-circle">{{ user.name.charAt(0) }}</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useLang } from '@/composables/useLang' 

const router = useRouter()
const user = ref(null)
const currentTime = ref('')
const { lang } = useLang() 

// === ЛОГИКА ТЕМЫ ===
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

let timer
onMounted(async () => {
  // Запускаем время
  updateTime()
  timer = setInterval(updateTime, 1000)

  // Инициализация темы при загрузке
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)

  // Загрузка профиля
  try {
    const res = await api.get('/auth/me')
    user.value = res.data
  } catch (e) { console.error('Ошибка профиля') }
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* Обрати внимание: я заменил background: white на var(--card-bg) */
.header { height: 60px; background: var(--card-bg, #ffffff); color: var(--text-primary, #1f2937); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: background 0.3s, color 0.3s; }
.header-left, .header-right { display: flex; align-items: center; }
.header-right { gap: 20px; }
.title { font-size: 16px; font-weight: 700; color: var(--text-primary, #1f2937); margin-left: 10px; }
.menu-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-secondary, #4b5563); }

/* ЯЗЫК И ИКОНКИ */
.header-actions { display: flex; align-items: center; gap: 16px; }
.lang-switcher { display: flex; gap: 6px; font-size: 14px; font-weight: 500; color: var(--text-secondary, #64748b); }
.lang-switcher span { cursor: pointer; transition: color 0.2s; }
.lang-switcher span:hover, .lang-switcher span.active { color: var(--accent-color, #dc2626); }
.divider { color: var(--border-color, #cbd5e1); cursor: default; }

.icon-group { display: flex; gap: 14px; align-items: center; }
.icon-btn { background: none; border: none; width: 20px; height: 20px; color: var(--text-secondary, #64748b); cursor: pointer; position: relative; padding: 0; transition: color 0.2s; }
.icon-btn:hover { color: var(--text-primary, #1f2937); }
.theme-toggle { font-size: 16px; display: flex; justify-content: center; align-items: center; }
.notification { position: relative; }
.badge { position: absolute; top: -6px; right: -8px; background: #dc2626; color: white; font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 10px; border: 2px solid var(--card-bg, white); }

/* ЧАСЫ И ПРОФИЛЬ */
.header-clock { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-secondary, #475569); background: var(--bg-color, #f1f5f9); padding: 4px 10px; border-radius: 8px; }
.user-profile { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px; border-radius: 16px; }
.user-info { display: flex; flex-direction: column; text-align: right; }
.name { font-size: 13px; font-weight: 600; }
.group { font-size: 11px; color: var(--text-secondary, #9ca3af); }
.avatar-circle { width: 32px; height: 32px; background: var(--accent-color, #4f7cff); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }

@media (max-width: 768px) {
  .header-actions, .header-clock { display: none; }
}
</style>