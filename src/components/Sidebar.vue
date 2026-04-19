<template>
  <div v-if="modelValue" class="overlay" @click="close">
    <aside class="sidebar" @click.stop>
      <div class="sidebar-header">
        <div v-if="user">
          <h2>{{ user.name }}</h2>
          <p>{{ user.group ? user.group : 'Студент' }}</p>
        </div>
        <button @click="close">✕</button>
      </div>

      <nav class="menu-list">
        <div class="menu-item" @click="go('/schedule')">📅 {{ text[lang].schedule }}</div>
        <div class="menu-item" @click="go('/gradebook')">🎓 {{ text[lang].grades }}</div>
        <div class="menu-item" @click="go('/courses')">📚 {{ text[lang].courses }}</div>
        <div class="menu-item" @click="go('/documents')">📄 {{ text[lang].docs }}</div>
        <div class="menu-item logout" @click="logout">🚪 {{ text[lang].logout }}</div>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useLang } from '@/composables/useLang' // Подключаем язык

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const auth = useAuthStore()

const user = ref(null)
const { lang } = useLang() // Достаем глобальный язык

// Словарь для сайдбара
const text = {
  ru: { schedule: 'Расписание', grades: 'Зачетная книжка', courses: 'Мои курсы', docs: 'Документы', logout: 'Выйти' },
  kk: { schedule: 'Сабақ кестесі', grades: 'Сынақ кітапшасы', courses: 'Менің курстарым', docs: 'Құжаттар', logout: 'Шығу' },
  en: { schedule: 'Schedule', grades: 'Gradebook', courses: 'My Courses', docs: 'Documents', logout: 'Logout' }
}

onMounted(async () => {
  try {
    const res = await api.get('/auth/me')
    user.value = res.data
  } catch (e) { console.error('Ошибка в Sidebar') }
})

function close() { emit('update:modelValue', false) }
function go(path) { router.push(path); close() }
function logout() { localStorage.removeItem('token'); auth.logout(); close(); router.push('/login') }
</script>

<style scoped>
/* Стили оставляешь те же самые, что были у тебя в Sidebar.vue */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; backdrop-filter: blur(2px); }
.sidebar { width: 320px; max-width: 85%; height: 100%; background: white; padding: 30px 20px; display: flex; flex-direction: column; box-shadow: 10px 0 25px rgba(0,0,0,0.1); }
.sidebar-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
.sidebar-header h2 { font-size: 22px; margin: 0; color: #1f2937; }
.sidebar-header p { font-size: 14px; color: #64748b; margin: 4px 0 0 0; }
.sidebar-header button { border: none; background: #f1f5f9; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; }
.menu-list { display: flex; flex-direction: column; gap: 8px; }
.menu-item { padding: 14px 16px; font-size: 18px; cursor: pointer; border-radius: 12px; transition: all 0.2s; color: #374151; }
.menu-item:hover { background: #f8fafc; color: #4f7cff; padding-left: 20px; }
.logout { margin-top: 20px; color: #ef4444; font-weight: 600; }
.logout:hover { background: #fff5f5; color: #dc2626; }
</style>