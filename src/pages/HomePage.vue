<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content" v-if="data">
      
      <div class="section-card summary-section">
        <div class="section-header">
          <h3>{{ text[lang].summaryTitle }}</h3>
          <span class="icon">🎓</span>
        </div>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">{{ text[lang].gpa }}</span>
            <span class="value">{{ data.summary.gpa }}</span>
            <span class="trend green">↑ +0.12</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ text[lang].attendance }}</span>
            <span class="value">{{ data.summary.attendance }}%</span>
            <div class="progress-bar"><div class="fill" :style="{ width: data.summary.attendance + '%' }"></div></div>
          </div>
          <div class="summary-item full-width">
            <span class="label">{{ text[lang].credits }}</span>
            <span class="value">{{ data.summary.credits }} <span class="total">/ {{ data.summary.totalCredits }} ECTS</span></span>
            <div class="progress-bar"><div class="fill" :style="{ width: (data.summary.credits / data.summary.totalCredits * 100) + '%' }"></div></div>
          </div>
        </div>
      </div>

      <div class="section-card schedule-section">
        <div class="section-header">
          <h3>{{ text[lang].scheduleTitle }}</h3>
          <span class="icon">📅</span>
        </div>
        <div class="schedule-list">
          <div v-for="item in data.schedule" :key="item.id" class="schedule-item">
            <span class="time">{{ item.time }}</span>
            <div class="subject-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.type }} • Ауд. {{ item.room }}</p>
            </div>
          </div>
        </div>
        <a href="#" class="full-link" @click.prevent="router.push('/schedule')">{{ text[lang].fullSchedule }}</a>
      </div>

      <div class="section-card deadlines-section">
        <div class="section-header">
          <h3>{{ text[lang].deadlinesTitle }}</h3>
          <span class="icon">🎯</span>
        </div>
        <div class="deadlines-list">
          <div v-for="deadline in data.deadlines" :key="deadline.id" class="deadline-item">
            <span class="status-icon alert">!</span>
            <div class="deadline-info">
              <h4>{{ deadline.title }}</h4>
              <p>{{ deadline.subject }}</p>
            </div>
            <span class="date">{{ deadline.date }}</span>
          </div>
        </div>
      </div>

      <div class="ai-banner-card" @click="router.push('/ai')">
        <div class="ai-icon">🧠</div>
        <div class="ai-text">
          <h3>{{ text[lang].aiTitle }}</h3>
          <p>{{ text[lang].aiSubtitle }}</p>
        </div>
        <span class="arrow">→</span>
      </div>

      <div class="section-card courses-section">
        <div class="section-header">
          <h3>{{ text[lang].coursesTitle }}</h3>
          <span class="icon">📚</span>
        </div>
        <div class="courses-grid">
          <div v-for="course in data.courses" :key="course.id" class="course-card">
            <h4>{{ course.title }}</h4>
            <p>{{ text[lang].teacher }}: {{ course.teacher || 'Не указан' }}</p>
          </div>
        </div>
      </div>

    </main>

    <div v-else class="loading">{{ text[lang].loading }}</div>

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
import { useLang } from '@/composables/useLang' // ПОДКЛЮЧАЕМ ЯЗЫК

const router = useRouter()
const sidebarOpen = ref(false)
const data = ref(null)

const { lang } = useLang() // ДОСТАЕМ ТЕКУЩИЙ ЯЗЫК

// СЛОВАРЬ ПЕРЕВОДОВ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ
const text = {
  ru: {
    summaryTitle: 'Академическая сводка',
    gpa: 'Средний балл (GPA)',
    attendance: 'Посещаемость',
    credits: 'Кредиты',
    scheduleTitle: 'Расписание на сегодня',
    fullSchedule: 'Полное расписание →',
    deadlinesTitle: 'Ближайшие дедлайны',
    aiTitle: 'ИИ-Помощник AURA',
    aiSubtitle: 'Получить помощь по учебным материалам',
    coursesTitle: 'Мои курсы',
    teacher: 'Преподаватель',
    loading: 'Загрузка данных...'
  },
  kk: {
    summaryTitle: 'Академиялық жиынтық',
    gpa: 'Орташа балл (GPA)',
    attendance: 'Сабаққа қатысу',
    credits: 'Кредиттер',
    scheduleTitle: 'Бүгінгі сабақ кестесі',
    fullSchedule: 'Толық кесте →',
    deadlinesTitle: 'Жақын арадағы дедлайндар',
    aiTitle: 'ЖИ-Көмекші AURA',
    aiSubtitle: 'Оқу материалдары бойынша көмек алу',
    coursesTitle: 'Менің курстарым',
    teacher: 'Оқытушы',
    loading: 'Мәліметтер жүктелуде...'
  },
  en: {
    summaryTitle: 'Academic Summary',
    gpa: 'Grade Point Average (GPA)',
    attendance: 'Attendance',
    credits: 'Credits',
    scheduleTitle: 'Today\'s Schedule',
    fullSchedule: 'Full schedule →',
    deadlinesTitle: 'Upcoming Deadlines',
    aiTitle: 'AI Assistant AURA',
    aiSubtitle: 'Get help with study materials',
    coursesTitle: 'My Courses',
    teacher: 'Instructor',
    loading: 'Loading data...'
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/summary')
    data.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки главной страницы:', e)
  }
})
</script>

<style scoped>
/* Твои стили остались без изменений */
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 16px; max-width: 1200px; margin: 0 auto; display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .content { grid-template-columns: repeat(2, 1fr); } .summary-section, .ai-banner-card { grid-column: span 2; } }
@media (min-width: 1024px) { .content { grid-template-columns: repeat(3, 1fr); } .summary-section { grid-column: span 2; } .schedule-section { grid-column: span 1; grid-row: span 2; } .ai-banner-card { grid-column: span 2; } .courses-section { grid-column: span 3; } }
.section-card { background: white; border-radius: 24px; padding: 20px; border: 1px solid #eef2f7; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.section-header h3 { font-size: 16px; font-weight: 700; color: #2d3748; }
.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.summary-item { background: #f8fafc; padding: 16px; border-radius: 16px; }
.summary-item.full-width { grid-column: span 2; }
.summary-item .label { font-size: 11px; color: #718096; display: block; margin-bottom: 4px; }
.summary-item .value { font-size: 20px; font-weight: 700; color: #2d3748; }
.summary-item .value .total { font-size: 12px; color: #a0aec0; font-weight: 400; }
.trend.green { color: #48bb78; font-size: 11px; margin-left: 6px; }
.schedule-list { display: flex; flex-direction: column; gap: 10px; }
.schedule-item { display: flex; gap: 12px; align-items: center; background: #f8fafc; padding: 12px; border-radius: 16px; }
.schedule-item .time { color: #4f7cff; font-weight: 600; font-size: 14px; }
.subject-info h4 { font-size: 14px; margin: 0; color: #2d3748; }
.subject-info p { font-size: 11px; margin: 0; color: #a0aec0; }
.full-link { display: block; text-align: center; margin-top: 15px; color: #4f7cff; font-size: 13px; text-decoration: none; font-weight: 600; }
.deadlines-list { display: flex; flex-direction: column; gap: 10px; }
.deadline-item { display: flex; align-items: center; gap: 12px; background: white; padding: 14px; border-radius: 16px; border: 1px solid #f1f5f9; }
.status-icon.alert { background: #fff5f5; color: #f56565; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.deadline-info h4 { font-size: 14px; margin: 0; color: #2d3748; }
.deadline-info p { font-size: 11px; margin: 0; color: #a0aec0; }
.deadline-item .date { margin-left: auto; color: #718096; font-size: 12px; }
.ai-banner-card { background: linear-gradient(135deg, #4f7cff 0%, #3a5ccc 100%); color: white; border-radius: 24px; padding: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: transform 0.2s; }
.ai-banner-card:hover { transform: translateY(-3px); }
.ai-icon { font-size: 30px; }
.ai-text h3 { font-size: 16px; margin: 0; font-weight: 700; }
.ai-text p { font-size: 12px; margin: 0; opacity: 0.8; }
.ai-banner-card .arrow { margin-left: auto; font-size: 20px; }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
.course-card { background: #f8fafc; padding: 16px; border-radius: 16px; }
.course-card h4 { font-size: 14px; color: #2d3748; margin-bottom: 5px; }
.course-card p { font-size: 11px; color: #a0aec0; }
.progress-bar { height: 6px; background: #edf2f7; border-radius: 3px; margin-top: 6px; overflow: hidden; }
.progress-bar .fill { height: 100%; background: #4f7cff; border-radius: 3px; }
.summary-item:nth-child(2) .fill { background: #48bb78; }
.loading { text-align: center; padding: 40px; color: #718096; }
</style>