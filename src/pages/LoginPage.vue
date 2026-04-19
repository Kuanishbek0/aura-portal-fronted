<template>
  <div class="login-page">
    
    <div class="left-side">
      <div class="branding">
        <h1 class="logo">Академический портал</h1>
      </div>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/user-login-4268415-3551762.png" alt="Login" class="illustration" />
    </div>

    <div class="right-side">
      <div class="login-card">
        
        <div class="uni-logo">
          <div class="logo-circle">🎓</div>
        </div>

        <h2 class="title">{{ text[lang].title }}</h2>

        <div class="lang-selector">
          <select v-model="lang">
            <option value="kk">Қазақша</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <form @submit.prevent="handleLogin" class="form">
          <div class="input-group">
            <label>{{ text[lang].login }}</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="student@university.kz" 
              required 
            />
          </div>

          <div class="input-group">
            <div class="label-row">
              <label>{{ text[lang].password }}</label>
              <router-link to="/forgot-password" class="forgot-link">
                {{ text[lang].forgot }}
              </router-link>
            </div>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '...' : text[lang].btn }}
          </button>
        </form>

        <div class="extra-links">
          <span>{{ text[lang].noAccount }}</span>
          <router-link to="/register" class="reg-link">{{ text[lang].register }}</router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api' 

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

// ЯЗЫКОВАЯ ЛОГИКА
import { useLang } from '@/composables/useLang'
const { lang } = useLang()

// Словарик переводов
const text = {
  ru: {
    title: 'Вход в личный кабинет',
    login: 'Логин (Email)',
    password: 'Пароль',
    forgot: 'Забыли пароль?',
    btn: 'Войти',
    noAccount: 'Нет аккаунта?',
    register: 'Регистрация'
  },
  kk: {
    title: 'Жеке кабинетке кіру',
    login: 'Логин (Email)',
    password: 'Құпия сөз',
    forgot: 'Құпия сөзді ұмыттыңыз ба?',
    btn: 'Кіру',
    noAccount: 'Аккаунтыңыз жоқ па?',
    register: 'Тіркелу'
  },
  en: {
    title: 'Login to Cabinet',
    login: 'Login (Email)',
    password: 'Password',
    forgot: 'Forgot password?',
    btn: 'Sign In',
    noAccount: 'Don\'t have an account?',
    register: 'Sign Up'
  }
}

// ЛОГИКА ВХОДА
const handleLogin = async () => {
  isLoading.value = true
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    router.push('/') 
  } catch (error) {
    alert('Ошибка входа. Проверьте логин или пароль.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ОБЩИЙ КОНТЕЙНЕР */
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* ЛЕВАЯ ЧАСТЬ */
.left-side {
  flex: 0 0 35%;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.branding {
  position: absolute;
  top: 40px;
  left: 40px;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

.illustration {
  max-width: 65%;
  height: auto;
  object-fit: contain;
}

/* ПРАВАЯ ЧАСТЬ */
.right-side {
  flex: 1;
  background-color: #ffffff; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.uni-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 2px solid #e2e8f0;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 20px;
}

/* ВЫБОР ЯЗЫКА */
.lang-selector {
  margin-bottom: 24px;
}

.lang-selector select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  color: #374151;
  outline: none;
  cursor: pointer;
}

/* ФОРМА */
.input-group {
  margin-bottom: 20px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
}

.forgot-link {
  font-size: 12px;
  color: #4f7cff;
  text-decoration: none;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
}

input:focus {
  border-color: #4f7cff;
}

/* КНОПКА ВОЙТИ */
.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #4f7cff; 
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #3b66f5; 
}

.submit-btn:disabled {
  background-color: #9ca3af;
}

/* НИЖНИЕ ССЫЛКИ */
.extra-links {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.reg-link {
  color: #4f7cff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

/* АДАПТИВНОСТЬ ДЛЯ ТЕЛЕФОНОВ */
@media (max-width: 768px) {
  .left-side {
    display: none;
  }
  .right-side {
    background-color: white;
  }
  .login-card {
    box-shadow: none;
    padding: 20px;
  }
}
</style>