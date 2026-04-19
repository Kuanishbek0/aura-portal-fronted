<template>
  <div class="auth-page">
    <div class="left-side">
      <div class="branding">
        <h1 class="logo">Академический портал</h1>
      </div>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/forgot-password-8044238-6430775.png" alt="Forgot Password" class="illustration" />
    </div>

    <div class="right-side">
      <div class="login-card">
        
        <div class="uni-logo">
          <div class="logo-circle">🔐</div>
        </div>

        <h2 class="title">{{ text[lang].title }}</h2>
        <p class="subtitle" v-if="!isSent">{{ text[lang].subtitle }}</p>

        <div class="lang-selector">
          <select v-model="lang">
            <option value="kk">Қазақша</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div v-if="isSent" class="success-message">
          <span class="check-icon">✓</span>
          <p>{{ text[lang].successText }}</p>
          <router-link to="/login" class="back-btn">{{ text[lang].backToLogin }}</router-link>
        </div>

        <form v-else @submit.prevent="handleForgot" class="form">
          <div class="input-group">
            <label>{{ text[lang].email }}</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="student@university.kz" 
              required 
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '...' : text[lang].btnSend }}
          </button>
        </form>

        <div v-if="!isSent" class="extra-links">
          <router-link to="/login" class="reg-link">← {{ text[lang].backToLogin }}</router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useLang } from '@/composables/useLang'

const { lang } = useLang()
const email = ref('')
const isLoading = ref(false)
const isSent = ref(false) // Флаг успешной отправки

const text = {
  ru: {
    title: 'Восстановление пароля', subtitle: 'Введите ваш email, и мы отправим ссылку для сброса',
    email: 'Ваш Email', btnSend: 'Отправить ссылку', backToLogin: 'Вернуться ко входу',
    successText: 'Ссылка отправлена! Проверьте вашу почту.'
  },
  kk: {
    title: 'Құпия сөзді қалпына келтіру', subtitle: 'Email енгізіңіз, біз қалпына келтіру сілтемесін жібереміз',
    email: 'Сіздің Email', btnSend: 'Сілтемені жіберу', backToLogin: 'Кіру бетіне оралу',
    successText: 'Сілтеме жіберілді! Поштаңызды тексеріңіз.'
  },
  en: {
    title: 'Password Recovery', subtitle: 'Enter your email and we will send a reset link',
    email: 'Your Email', btnSend: 'Send Reset Link', backToLogin: 'Back to Login',
    successText: 'Link sent! Please check your email.'
  }
}

const handleForgot = async () => {
  isLoading.value = true
  try {
    // ДОБАВЬ /api ПЕРЕД /auth
    await api.post('/auth/forgot-password', { email: email.value })
    isSent.value = true
  } catch (error) {
    // Давай выведем ошибку в консоль, чтобы ты увидел, что пишет сервер
    console.error("Ошибка сервера:", error.response ? error.response.data : error.message);
    alert('Ошибка. Возможно, такой email не зарегистрирован.');
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили абсолютно идентичны странице входа (сплит-экран) */
.auth-page { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
.left-side { flex: 0 0 35%; background-color: #f8fafc; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; position: relative; }
.branding { position: absolute; top: 40px; left: 40px; }
.logo { font-size: 24px; font-weight: 800; color: #1f2937; margin: 0; }
.illustration { max-width: 65%; height: auto; object-fit: contain; }
.right-side { flex: 1; background-color: #ffffff; display: flex; justify-content: center; align-items: center; padding: 20px; }
.login-card { background: white; width: 100%; max-width: 420px; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }
.uni-logo { display: flex; justify-content: center; margin-bottom: 15px; }
.logo-circle { width: 60px; height: 60px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; border: 2px solid #e2e8f0; }
.title { font-size: 22px; font-weight: 600; color: #1f2937; text-align: center; margin-bottom: 5px; }
.subtitle { font-size: 13px; color: #64748b; text-align: center; margin-bottom: 20px; line-height: 1.4; }
.lang-selector { margin-bottom: 24px; }
.lang-selector select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; cursor: pointer; }
.input-group { margin-bottom: 20px; }
label { display: block; font-size: 13px; font-weight: 500; color: #6b7280; margin-bottom: 6px; }
input { width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none; box-sizing: border-box; }
input:focus { border-color: #4f7cff; }
.submit-btn { width: 100%; padding: 14px; background-color: #4f7cff; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: background 0.2s; }
.submit-btn:hover { background-color: #3b66f5; }
.submit-btn:disabled { background-color: #9ca3af; }
.extra-links { margin-top: 24px; text-align: center; }
.reg-link { color: #4f7cff; text-decoration: none; font-size: 14px; font-weight: 600; }
.success-message { text-align: center; background: #f0fff4; padding: 30px 20px; border-radius: 12px; border: 1px solid #c6f6d5; }
.check-icon { display: inline-flex; justify-content: center; align-items: center; width: 40px; height: 40px; background: #48bb78; color: white; border-radius: 50%; font-size: 20px; font-weight: bold; margin-bottom: 10px; }
.success-message p { color: #2f855a; font-weight: 500; margin-bottom: 20px; }
.back-btn { display: inline-block; padding: 10px 20px; background: #4f7cff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
/* === ФИНАЛЬНАЯ АДАПТИВНОСТЬ === */
@media (max-width: 768px) {
  /* Форсируем отображение контейнера как колонки */
  .auth-page, .login-page { 
    flex-direction: column !important; 
    display: flex !important;
  }

  /* Заставляем левую сторону ПОКАЗАТЬСЯ */
  .left-side {
    display: flex !important; /* Убирает display: none, если он где-то застрял */
    flex: none !important;
    width: 100% !important;
    padding: 20px !important;
    background-color: #f8fafc !important;
    min-height: 250px !important; /* Даем минимальную высоту, чтобы не схлопывалось */
  }

  /* Выравниваем логотип и картинку по центру */
  .branding {
    position: static !important;
    margin-bottom: 20px !important;
    text-align: center !important;
  }

  .illustration {
    display: block !important;
    max-width: 160px !important;
    height: auto !important;
    margin: 0 auto !important;
  }

  /* Настраиваем правую сторону, чтобы не наползала */
  .right-side {
    flex: 1 !important;
    padding: 10px !important;
    background-color: white !important;
  }

  .login-card {
    box-shadow: none !important;
    padding: 20px !important;
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style>