<template>
  <div class="auth-page">
    
    <div class="left-side">
      <div class="branding">
        <h1 class="logo">Академический портал</h1>
      </div>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-8694031-6983270.png" alt="Register" class="illustration" />
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

        <form @submit.prevent="handleRegister" class="form">
          
          <div class="input-group">
            <label>{{ text[lang].name }}</label>
            <input 
              v-model="name" 
              type="text" 
              placeholder="Иванов Иван" 
              required 
            />
          </div>

          <div class="input-group">
            <label>{{ text[lang].email }}</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="student@university.kz" 
              required 
            />
          </div>

          <div class="input-group">
            <label>{{ text[lang].password }}</label>
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
          <span>{{ text[lang].hasAccount }}</span>
          <router-link to="/login" class="reg-link">{{ text[lang].login }}</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// ЯЗЫКОВАЯ ЛОГИКА
import { useLang } from '@/composables/useLang'

const { lang } = useLang()

// Словарик переводов для регистрации
const text = {
  ru: {
    title: 'Регистрация',
    name: 'ФИО',
    email: 'Логин (Email)',
    password: 'Пароль',
    btn: 'Зарегистрироваться',
    hasAccount: 'Уже есть аккаунт?',
    login: 'Войти'
  },
  kk: {
    title: 'Тіркелу',
    name: 'Аты-жөні (ФИО)',
    email: 'Логин (Email)',
    password: 'Құпия сөз',
    btn: 'Тіркелу',
    hasAccount: 'Аккаунтыңыз бар ма?',
    login: 'Кіру'
  },
  en: {
    title: 'Sign Up',
    name: 'Full Name',
    email: 'Login (Email)',
    password: 'Password',
    btn: 'Create Account',
    hasAccount: 'Already have an account?',
    login: 'Sign In'
  }
}

// ЛОГИКА РЕГИСТРАЦИИ
const handleRegister = async () => {
  isLoading.value = true
  try {
    await api.post('/auth/register', { 
      name: name.value, 
      email: email.value, 
      password: password.value 
    })
    alert('Регистрация прошла успешно! Теперь вы можете войти.')
    router.push('/login') 
  } catch (error) {
    alert('Ошибка при регистрации. Возможно, такой email уже существует.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили абсолютно идентичны странице входа для 100% консистентности */
.auth-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

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
  max-width: 75%;
  height: auto;
  object-fit: contain;
}

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

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
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