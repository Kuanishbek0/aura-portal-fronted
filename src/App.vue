<template>
  <router-view />
</template>

<script setup>
// Скрипт оставляем пустым, так как логика темы находится в AppHeader
</script>

<style>
/* ВНИМАНИЕ: Здесь нет слова 'scoped'! 
  Это значит, что эти переменные будут работать на ВСЕХ страницах сайта.
*/

/* === СВЕТЛАЯ ТЕМА (По умолчанию) === */
:root {
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --accent-color: #4f7cff;
  --border-color: #e2e8f0;
}

/* === ТЕМНАЯ ТЕМА (Dark Tech) === */
[data-theme='dark'] {
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent-color: #38bdf8;
  --border-color: #334155;
}

/* Применяем цвета к фону всего сайта */
body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  margin: 0;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>