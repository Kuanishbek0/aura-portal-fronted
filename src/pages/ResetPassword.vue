<template>
  <div class="auth-page">
    <div class="left-side">
      <div class="branding">
        <h1 class="logo">Академический портал</h1>
      </div>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/reset-password-8044240-6430777.png" alt="Reset Password" class="illustration" />
    </div>

    <div class="right-side">
      <div class="login-card">
        
        <div class="uni-logo">
          <div class="logo-circle">🔑</div>
        </div>

        <h2 class="title">{{ text[lang].title }}</h2>

        <div v-if="isSuccess" class="success-message">
          <span class="check-icon">✓</span>
          <p>{{ text[lang].successText }}</p>
          <router-link to="/login" class="back-btn">{{ text[lang].goToLogin }}</router-link>
        </div>

        <div v-else-if="tokenError" class="error-message">
          ❌ {{ text[lang].tokenError }}
        </div>

        <form v-else @submit.prevent="handleReset" class="form">
          <div class="input-group">
            <label>{{ text[lang].newPass }}</label>
            <input v-model="password" type="password" placeholder="••••••••" required />
          </div>

          <div class="input-group">
            <label>{{ text[lang].confirmPass }}</label>
            <input v-model="confirmPassword" type="password" placeholder="••••••••" required />
            <p v-if="error" class="error-text">{{ error }}</p>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '...' : text[lang].btnSave }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useLang } from '@/composables/useLang'

const { lang } = useLang()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref('')
const tokenError = ref(false)
const token = ref('')

const text = {
  ru: {
    title: 'Новый пароль', newPass: 'Новый пароль', confirmPass: 'Повторите пароль',
    btnSave: 'Сохранить пароль', errorMatch: 'Пароли не совпадают!', 
    tokenError: 'Ссылка недействительна или устарела.',
    successText: 'Пароль успешно изменен!', goToLogin: 'Войти в аккаунт'
  },
  kk: {
    title: 'Жаңа құпия сөз', newPass: 'Жаңа құпия сөз', confirmPass: 'Құпия сөзді қайталаңыз',
    btnSave: 'Сақтау', errorMatch: 'Құпия сөздер сәйкес келмейді!', 
    tokenError: 'Сілтеме жарамсыз немесе мерзімі өткен.',
    successText: 'Құпия сөз сәтті өзгертілді!', goToLogin: 'Аккаунтқа кіру'
  },
  en: {
    title: 'New Password', newPass: 'New Password', confirmPass: 'Confirm Password',
    btnSave: 'Save Password', errorMatch: 'Passwords do not match!', 
    tokenError: 'Link is invalid or expired.',
    successText: 'Password changed successfully!', goToLogin: 'Go to Login'
  }
}

// При загрузке страницы проверяем, есть ли токен в URL
onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token
  } else {
    tokenError.value = true // Если зашли без токена
  }
})

const handleReset = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = text[lang.value].errorMatch
    return
  }

  isLoading.value = true
  try {
    await api.post('/auth/reset-password', { 
      token: token.value, 
      password: password.value 
    })
    isSuccess.value = true
  } catch (err) {
    tokenError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили те же самые, что и выше */
.auth-page { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
.left-side { flex: 0 0 35%; background-color: #f8fafc; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; position: relative; }
.branding { position: absolute; top: 40px; left: 40px; }
.logo { font-size: 24px; font-weight: 800; color: #1f2937; margin: 0; }
.illustration { max-width: 65%; height: auto; object-fit: contain; }
.right-side { flex: 1; background-color: #ffffff; display: flex; justify-content: center; align-items: center; padding: 20px; }
.login-card { background: white; width: 100%; max-width: 420px; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }
.uni-logo { display: flex; justify-content: center; margin-bottom: 15px; }
.logo-circle { width: 60px; height: 60px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; border: 2px solid #e2e8f0; }
.title { font-size: 22px; font-weight: 600; color: #1f2937; text-align: center; margin-bottom: 24px; }
.input-group { margin-bottom: 20px; }
label { display: block; font-size: 13px; font-weight: 500; color: #6b7280; margin-bottom: 6px; }
input { width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none; box-sizing: border-box; }
input:focus { border-color: #4f7cff; }
.submit-btn { width: 100%; padding: 14px; background-color: #4f7cff; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: background 0.2s; }
.submit-btn:hover { background-color: #3b66f5; }
.submit-btn:disabled { background-color: #9ca3af; }
.error-text { color: #e11d48; font-size: 12px; margin-top: 5px; font-weight: 500; }
.error-message { background: #fff1f2; color: #e11d48; padding: 15px; border-radius: 8px; text-align: center; font-weight: 500; }
.success-message { text-align: center; background: #f0fff4; padding: 30px 20px; border-radius: 12px; border: 1px solid #c6f6d5; }
.check-icon { display: inline-flex; justify-content: center; align-items: center; width: 40px; height: 40px; background: #48bb78; color: white; border-radius: 50%; font-size: 20px; font-weight: bold; margin-bottom: 10px; }
.success-message p { color: #2f855a; font-weight: 500; margin-bottom: 20px; }
.back-btn { display: inline-block; padding: 10px 20px; background: #4f7cff; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
@media (max-width: 768px) { .left-side { display: none; } .login-card { box-shadow: none; padding: 20px; } }
</style>