// src/composables/useLang.js
import { ref, watch } from 'vue'

// Достаем язык из памяти браузера (или ставим 'ru' по умолчанию)
const lang = ref(localStorage.getItem('app_lang') || 'ru')

// Как только язык меняется, сразу сохраняем его в память
watch(lang, (newVal) => {
  localStorage.setItem('app_lang', newVal)
})

export function useLang() {
  return { lang }
}