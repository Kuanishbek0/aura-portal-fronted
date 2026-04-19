<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="page-header">
        <h2>{{ text[lang].title }} 👤</h2>
      </div>

      <div class="profile-layout">
        <div class="profile-card user-main">
          <div class="avatar-large">{{ user?.name?.charAt(0) || 'С' }}</div>
          <h3>{{ user?.name || text[lang].loading }}</h3>
          <p class="role">{{ text[lang].student }}</p>
          <div class="badge">{{ user?.group || 'ФИТ-301' }}</div>
        </div>

        <div class="profile-details">
          
          <div class="settings-block">
            <h3>{{ text[lang].personalInfo }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Email</span>
                <span class="value">{{ user?.email || 'student@university.kz' }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ text[lang].phone }}</span>
                <span class="value">+7 (707) 123-45-67</span>
              </div>
            </div>
          </div>

          <div class="settings-block">
            <h3>{{ text[lang].settings }}</h3>
            <div class="setting-row">
              <div>
                <h4>{{ text[lang].langPref }}</h4>
                <p>{{ text[lang].langDesc }}</p>
              </div>
              <select v-model="lang" class="lang-select">
                <option value="kk">Қазақша</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div class="setting-row">
              <div>
                <h4>{{ text[lang].password }}</h4>
                <p>••••••••</p>
              </div>
              <button class="outline-btn">{{ text[lang].change }}</button>
            </div>
          </div>

          <button class="logout-btn" @click="logout">{{ text[lang].logout }}</button>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import BottomNav from '@/components/BottomNav.vue'
import api from '@/services/api'
import { useLang } from '@/composables/useLang'

const { lang } = useLang()
const router = useRouter()
const sidebarOpen = ref(false)
const user = ref(null)

const text = {
  ru: {
    title: 'Мой профиль', student: 'Студент', loading: 'Загрузка...', personalInfo: 'Личные данные',
    phone: 'Телефон', settings: 'Настройки', langPref: 'Язык интерфейса', langDesc: 'Выберите предпочитаемый язык',
    password: 'Пароль', change: 'Изменить', logout: 'Выйти из аккаунта'
  },
  kk: {
    title: 'Менің профилім', student: 'Студент', loading: 'Жүктелуде...', personalInfo: 'Жеке мәліметтер',
    phone: 'Телефон', settings: 'Баптаулар', langPref: 'Интерфейс тілі', langDesc: 'Қалаған тілді таңдаңыз',
    password: 'Құпия сөз', change: 'Өзгерту', logout: 'Аккаунттан шығу'
  },
  en: {
    title: 'My Profile', student: 'Student', loading: 'Loading...', personalInfo: 'Personal Information',
    phone: 'Phone', settings: 'Settings', langPref: 'Interface Language', langDesc: 'Choose your preferred language',
    password: 'Password', change: 'Change', logout: 'Log out'
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/auth/me')
    user.value = res.data
  } catch (e) { console.error('Ошибка загрузки профиля') }
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 20px; max-width: 900px; margin: 0 auto; }
.page-header h2 { font-size: 24px; color: #1f2937; margin-bottom: 24px; }

.profile-layout { display: flex; gap: 24px; flex-wrap: wrap; }
@media (max-width: 768px) { .profile-layout { flex-direction: column; } }

.profile-card, .settings-block { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); }

/* Левая часть (Аватар) */
.user-main { flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; text-align: center; height: fit-content; }
.avatar-large { width: 100px; height: 100px; background: linear-gradient(135deg, #4f7cff 0%, #3a5ccc 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 700; margin-bottom: 16px; box-shadow: 0 10px 20px rgba(79, 124, 255, 0.2); }
.user-main h3 { margin: 0 0 4px 0; font-size: 20px; color: #1f2937; }
.user-main .role { margin: 0 0 16px 0; font-size: 14px; color: #64748b; }
.badge { background: #f1f5f9; color: #475569; padding: 6px 16px; border-radius: 12px; font-weight: 600; font-size: 13px; }

/* Правая часть (Настройки) */
.profile-details { flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 20px; }
.settings-block h3 { font-size: 16px; color: #1f2937; margin: 0 0 20px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 500px) { .info-grid { grid-template-columns: 1fr; } }
.info-item { background: #f8fafc; padding: 16px; border-radius: 12px; }
.info-item .label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
.info-item .value { font-size: 15px; font-weight: 600; color: #1f2937; }

.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; gap: 15px; }
.setting-row:last-child { border-bottom: none; padding-bottom: 0; }
.setting-row h4 { margin: 0 0 4px 0; font-size: 15px; color: #1f2937; }
.setting-row p { margin: 0; font-size: 13px; color: #64748b; }

.lang-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; outline: none; font-weight: 500; color: #1f2937; cursor: pointer; }
.outline-btn { background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #4f7cff; cursor: pointer; transition: all 0.2s; }
.outline-btn:hover { border-color: #4f7cff; background: #f8fafc; }

.logout-btn { width: 100%; padding: 14px; background: #fff5f5; color: #ef4444; border: 1px solid #fecaca; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
.logout-btn:hover { background: #fee2e2; }
</style>