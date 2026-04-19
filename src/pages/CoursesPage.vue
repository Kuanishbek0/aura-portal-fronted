<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="page-header">
        <h2>{{ text[lang].title }} 📚</h2>
        <div class="filter-tabs">
          <button class="active">{{ text[lang].active }}</button>
          <button>{{ text[lang].completed }}</button>
        </div>
      </div>

      <div class="courses-grid">
        <div v-for="(course, idx) in getCourses()" :key="idx" class="course-card">
          <div class="course-header">
            <div class="course-icon">{{ course.icon }}</div>
            <span class="status-badge" :class="{ 'done': course.progress === 100 }">
              {{ course.progress === 100 ? text[lang].completed : text[lang].inProgress }}
            </span>
          </div>
          
          <div class="course-info">
            <h3>{{ course.title }}</h3>
            <p>👨‍🏫 {{ text[lang].teacher }}: <span>{{ course.teacher }}</span></p>
          </div>

          <div class="course-progress">
            <div class="progress-labels">
              <span>{{ text[lang].progress }}</span>
              <span class="percent">{{ course.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="fill" :style="{ width: course.progress + '%' }" :class="{ 'full': course.progress === 100 }"></div>
            </div>
          </div>

          <button class="action-btn" :class="{ 'outline': course.progress === 100 }">
            {{ course.progress === 100 ? text[lang].viewCert : text[lang].continue }} →
          </button>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useLang } from '@/composables/useLang'

const { lang } = useLang()
const sidebarOpen = ref(false)

const text = {
  ru: {
    title: 'Мои курсы', active: 'Активные', completed: 'Завершенные',
    teacher: 'Преподаватель', progress: 'Прогресс', inProgress: 'В процессе',
    continue: 'Продолжить', viewCert: 'Сертификат',
    course1: 'Full-stack разработка (Vue/Node)', course2: 'UX/UI Дизайн в Figma', course3: 'Основы Python'
  },
  kk: {
    title: 'Менің курстарым', active: 'Белсенді', completed: 'Аяқталған',
    teacher: 'Оқытушы', progress: 'Прогресс', inProgress: 'Оқуда',
    continue: 'Жалғастыру', viewCert: 'Сертификат',
    course1: 'Full-stack әзірлеу (Vue/Node)', course2: 'Figma-да UX/UI дизайн', course3: 'Python негіздері'
  },
  en: {
    title: 'My Courses', active: 'Active', completed: 'Completed',
    teacher: 'Instructor', progress: 'Progress', inProgress: 'In Progress',
    continue: 'Continue', viewCert: 'Certificate',
    course1: 'Full-stack Dev (Vue/Node)', course2: 'UX/UI Design in Figma', course3: 'Python Basics'
  }
}

// Данные курсов (генерируются реактивно)
const getCourses = () => [
  { title: text[lang.value].course1, teacher: 'Сыздыков А.М.', progress: 65, icon: '💻' },
  { title: text[lang.value].course2, teacher: 'Иванова Е.В.', progress: 30, icon: '🎨' },
  { title: text[lang.value].course3, teacher: 'Омаров Т.К.', progress: 100, icon: '🐍' }
]
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 20px; max-width: 1000px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 15px; }
.page-header h2 { font-size: 24px; color: #1f2937; margin: 0; }

.filter-tabs { display: flex; gap: 10px; background: white; padding: 6px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.filter-tabs button { background: transparent; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; }
.filter-tabs button.active { background: #4f7cff; color: white; }

.courses-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }

.course-card { background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); display: flex; flex-direction: column; transition: transform 0.2s; }
.course-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

.course-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.course-icon { font-size: 32px; background: #f8fafc; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; }
.status-badge { background: #ebf2ff; color: #4f7cff; font-size: 11px; padding: 4px 10px; border-radius: 8px; font-weight: 700; text-transform: uppercase; }
.status-badge.done { background: #f0fff4; color: #10b981; }

.course-info { flex: 1; }
.course-info h3 { font-size: 16px; color: #1f2937; margin: 0 0 8px 0; line-height: 1.4; }
.course-info p { font-size: 13px; color: #64748b; margin: 0; }
.course-info p span { color: #1f2937; font-weight: 500; }

.course-progress { margin: 20px 0; }
.progress-labels { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
.progress-labels .percent { color: #4f7cff; }
.progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.progress-bar .fill { height: 100%; background: #4f7cff; border-radius: 3px; transition: width 0.5s ease; }
.progress-bar .fill.full { background: #10b981; }

.action-btn { width: 100%; padding: 12px; background: #4f7cff; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.action-btn:hover { background: #3b66f5; }
.action-btn.outline { background: transparent; border: 2px solid #10b981; color: #10b981; }
.action-btn.outline:hover { background: #f0fff4; }
</style>