<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="page-header">
        <h2>{{ text[lang].title }} 📅</h2>
        <div class="week-selector">
          <button class="nav-btn">←</button>
          <span>{{ text[lang].currentWeek }}</span>
          <button class="nav-btn">→</button>
        </div>
      </div>

      <div class="schedule-grid">
        <div v-for="day in getLocalizedSchedule()" :key="day.dayName" class="day-card">
          <div class="day-header">
            <h3>{{ day.dayName }}</h3>
            <span class="date-badge">{{ day.date }}</span>
          </div>
          
          <div class="lessons-list">
            <div v-if="day.lessons.length === 0" class="free-day">
              {{ text[lang].freeDay }} 🏖️
            </div>
            
            <div v-for="(lesson, idx) in day.lessons" :key="idx" class="lesson-item">
              <div class="lesson-time">
                <span class="start">{{ lesson.start }}</span>
                <span class="end">{{ lesson.end }}</span>
              </div>
              <div class="lesson-divider" :class="lesson.color"></div>
              <div class="lesson-info">
                <h4>{{ lesson.subject }}</h4>
                <p>{{ lesson.type }} • {{ text[lang].room }} {{ lesson.room }}</p>
                <div class="teacher">👨‍🏫 {{ lesson.teacher }}</div>
              </div>
            </div>
          </div>
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
    title: 'Расписание занятий',
    currentWeek: 'Текущая неделя',
    freeDay: 'Выходной день',
    room: 'Ауд.',
    mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг', fri: 'Пятница',
    web: 'Full-stack разработка (Vue/Node)',
    mobile: 'Мобильная разработка (React Native)',
    ai: 'Промпт-инжиниринг и ИИ',
    lec: 'Лекция', prac: 'Практика', lab: 'Лабораторная'
  },
  kk: {
    title: 'Сабақ кестесі',
    currentWeek: 'Ағымдағы апта',
    freeDay: 'Демалыс күні',
    room: 'Ауд.',
    mon: 'Дүйсенбі', tue: 'Сейсенбі', wed: 'Сәрсенбі', thu: 'Бейсенбі', fri: 'Жұма',
    web: 'Full-stack әзірлеу (Vue/Node)',
    mobile: 'Мобильді әзірлеу (React Native)',
    ai: 'Промпт-инжиниринг және ЖИ',
    lec: 'Дәріс', prac: 'Тәжірибе', lab: 'Зертханалық'
  },
  en: {
    title: 'Class Schedule',
    currentWeek: 'Current Week',
    freeDay: 'Day Off',
    room: 'Room',
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday',
    web: 'Full-stack Dev (Vue/Node)',
    mobile: 'Mobile Dev (React Native)',
    ai: 'Prompt Engineering & AI',
    lec: 'Lecture', prac: 'Practice', lab: 'Lab'
  }
}

const getLocalizedSchedule = () => [
  {
    dayName: text[lang.value].mon,
    date: '12.04',
    lessons: [
      { start: '10:00', end: '11:50', subject: text[lang.value].web, type: text[lang.value].lec, room: '305', teacher: 'Сыздыков А.М.', color: 'blue' },
      { start: '12:10', end: '14:00', subject: text[lang.value].ai, type: text[lang.value].prac, room: '210', teacher: 'Омаров Т.К.', color: 'purple' }
    ]
  },
  {
    dayName: text[lang.value].tue,
    date: '13.04',
    lessons: [
      { start: '09:00', end: '10:50', subject: text[lang.value].mobile, type: text[lang.value].lab, room: '412', teacher: 'Исаев Б.Н.', color: 'green' }
    ]
  },
  {
    dayName: text[lang.value].wed,
    date: '14.04',
    lessons: []
  }
]
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 20px; max-width: 1000px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 15px; }
.page-header h2 { font-size: 22px; color: #1f2937; margin: 0; }
.week-selector { display: flex; align-items: center; gap: 15px; background: white; padding: 6px 12px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.nav-btn { background: #f1f5f9; border: none; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; color: #4f7cff; font-weight: bold; }
.week-selector span { font-size: 14px; font-weight: 600; color: #374151; }

.schedule-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .schedule-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .schedule-grid { grid-template-columns: repeat(3, 1fr); } }

.day-card { background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); }
.day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
.day-header h3 { font-size: 16px; font-weight: 700; margin: 0; color: #1f2937; }
.date-badge { background: #f1f5f9; color: #64748b; font-size: 12px; padding: 4px 10px; border-radius: 8px; font-weight: 600; }

.lessons-list { display: flex; flex-direction: column; gap: 16px; }
.free-day { text-align: center; color: #94a3b8; font-size: 14px; padding: 20px 0; background: #f8fafc; border-radius: 12px; }

.lesson-item { display: flex; gap: 12px; }
.lesson-time { display: flex; flex-direction: column; justify-content: space-between; min-width: 45px; font-size: 13px; font-weight: 600; color: #475569; text-align: right; }
.lesson-time .end { color: #94a3b8; font-weight: 500; }
.lesson-divider { width: 4px; border-radius: 4px; }
.lesson-divider.blue { background: #4f7cff; }
.lesson-divider.purple { background: #8b5cf6; }
.lesson-divider.green { background: #10b981; }

.lesson-info { background: #f8fafc; padding: 12px; border-radius: 12px; flex: 1; }
.lesson-info h4 { font-size: 14px; margin: 0 0 6px 0; color: #1f2937; line-height: 1.4; }
.lesson-info p { font-size: 12px; color: #64748b; margin: 0 0 8px 0; }
.teacher { font-size: 11px; color: #4f7cff; background: #ebf2ff; display: inline-block; padding: 4px 8px; border-radius: 6px; font-weight: 600; }
</style>