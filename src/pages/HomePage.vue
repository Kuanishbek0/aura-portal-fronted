<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content" v-if="data">
      <section class="hero">
        <div>
          <h1>{{ text[lang].welcome }}, Хасен! 👋</h1>
          <p>{{ text[lang].welcomeSubtitle }}</p>
        </div>
      </section>

      <section class="dashboard-grid">
        <!-- Академическая сводка -->
        <div class="card academic-card">
          <div class="card-header">
            <h3>{{ text[lang].summaryTitle }}</h3>
            <span>🎓</span>
          </div>

          <div class="summary-grid">
            <div class="metric-box">
              <span class="metric-label">{{ text[lang].gpa }}</span>
              <div class="metric-value">
                {{ data.summary.gpa }}
                <span class="trend">↑ +0.12</span>
              </div>
            </div>

            <div class="metric-box">
              <span class="metric-label">{{ text[lang].attendance }}</span>
              <div class="metric-value">{{ data.summary.attendance }}%</div>
              <div class="progress">
                <div
                  class="progress-fill green"
                  :style="{ width: data.summary.attendance + '%' }"
                ></div>
              </div>
            </div>

            <div class="metric-box wide">
              <span class="metric-label">{{ text[lang].credits }}</span>
              <div class="metric-value">
                {{ data.summary.credits }}
                <span class="muted">/ {{ data.summary.totalCredits }} ECTS</span>
              </div>
              <div class="progress">
                <div
                  class="progress-fill blue"
                  :style="{ width: (data.summary.credits / data.summary.totalCredits * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Расписание -->
        <div class="card schedule-card">
          <div class="card-header">
            <h3>{{ text[lang].scheduleTitle }}</h3>
            <span>📅</span>
          </div>

          <div v-if="data.schedule?.length" class="schedule-list">
            <div
              v-for="item in data.schedule"
              :key="item.id"
              class="schedule-item"
            >
              <div class="schedule-time">{{ item.time }}</div>

              <div>
                <h4>{{ item.title }}</h4>
                <p>{{ item.type }} • Ауд. {{ item.room }}</p>
                <p v-if="item.teacher">👨‍🏫 {{ item.teacher }}</p>
              </div>
            </div>
          </div>

          <div v-else class="empty-schedule">
            <p>{{ text[lang].noSchedule }}</p>
          </div>

          <button class="link-button" @click="router.push('/schedule')">
            {{ text[lang].fullSchedule }}
          </button>
        </div>

        <!-- Дедлайны -->
        <div class="card deadlines-card">
          <div class="card-header">
            <h3>{{ text[lang].deadlinesTitle }}</h3>
            <span>🎯</span>
          </div>

          <div class="deadline-list">
            <div
              v-for="deadline in data.deadlines"
              :key="deadline.id"
              class="deadline-item"
            >
              <div class="alert-icon">!</div>

              <div class="deadline-info">
                <h4>{{ deadline.title }}</h4>
                <p>{{ deadline.subject }}</p>
              </div>

              <span class="deadline-date">{{ deadline.date }}</span>
            </div>
          </div>
        </div>

        <!-- AI баннер -->
        <div class="ai-banner" @click="router.push('/ai')">
          <div class="ai-icon">🧠</div>

          <div>
            <h3>{{ text[lang].aiTitle }}</h3>
            <p>{{ text[lang].aiSubtitle }}</p>
          </div>

          <span class="ai-arrow">→</span>
        </div>

        <!-- Курсы -->
        <div class="card courses-card">
          <div class="card-header">
            <h3>{{ text[lang].coursesTitle }}</h3>
            <span>📚</span>
          </div>

          <div class="courses-grid">
            <div
              v-for="course in data.courses"
              :key="course.id"
              class="course-card"
            >
              <div class="course-icon">📘</div>
              <h4>{{ course.title }}</h4>
              <p>{{ text[lang].teacher }}: {{ course.teacher || text[lang].notSet }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div v-else class="loading">
      {{ text[lang].loading }}
    </div>

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

const router = useRouter()
const sidebarOpen = ref(false)
const data = ref(null)

const { lang } = useLang()

const text = {
  ru: {
    welcome: 'Добро пожаловать',
    welcomeSubtitle: 'Сегодня отличный день для продуктивного обучения.',
    summaryTitle: 'Академическая сводка',
    gpa: 'Средний балл (GPA)',
    attendance: 'Посещаемость',
    credits: 'Кредиты',
    scheduleTitle: 'Расписание на сегодня',
    fullSchedule: 'Полное расписание →',
    noSchedule: 'На сегодня занятий нет',
    deadlinesTitle: 'Ближайшие дедлайны',
    aiTitle: 'ИИ-Помощник AURA',
    aiSubtitle: 'Получить помощь по учебным материалам',
    coursesTitle: 'Мои курсы',
    teacher: 'Преподаватель',
    notSet: 'Не указан',
    loading: 'Загрузка данных...'
  },
  kk: {
    welcome: 'Қош келдіңіз',
    welcomeSubtitle: 'Бүгін өнімді оқу үшін сәтті күн.',
    summaryTitle: 'Академиялық жиынтық',
    gpa: 'Орташа балл (GPA)',
    attendance: 'Сабаққа қатысу',
    credits: 'Кредиттер',
    scheduleTitle: 'Бүгінгі сабақ кестесі',
    fullSchedule: 'Толық кесте →',
    noSchedule: 'Бүгін сабақ жоқ',
    deadlinesTitle: 'Жақын арадағы дедлайндар',
    aiTitle: 'ЖИ-Көмекші AURA',
    aiSubtitle: 'Оқу материалдары бойынша көмек алу',
    coursesTitle: 'Менің курстарым',
    teacher: 'Оқытушы',
    notSet: 'Көрсетілмеген',
    loading: 'Мәліметтер жүктелуде...'
  },
  en: {
    welcome: 'Welcome',
    welcomeSubtitle: 'Today is a great day for productive learning.',
    summaryTitle: 'Academic Summary',
    gpa: 'Grade Point Average (GPA)',
    attendance: 'Attendance',
    credits: 'Credits',
    scheduleTitle: "Today's Schedule",
    fullSchedule: 'Full schedule →',
    noSchedule: 'No classes today',
    deadlinesTitle: 'Upcoming Deadlines',
    aiTitle: 'AI Assistant AURA',
    aiSubtitle: 'Get help with study materials',
    coursesTitle: 'My Courses',
    teacher: 'Instructor',
    notSet: 'Not set',
    loading: 'Loading data...'
  }
}

onMounted(async () => {
  try {
    const summaryRes = await api.get('/dashboard/summary')
    const scheduleRes = await api.get('/schedule/today')

    data.value = {
      ...summaryRes.data,
      schedule: scheduleRes.data,
      courses: summaryRes.data.courses || []
    }
  } catch (e) {
    console.error('Ошибка загрузки главной страницы:', e)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7fbff;
  padding-bottom: 90px;
}

.content {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.hero {
  margin-bottom: 24px;
}

.hero h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #172b4d;
  letter-spacing: -0.03em;
}

.hero p {
  margin: 8px 0 0;
  color: #8a9bb3;
  font-size: 15px;
  font-weight: 500;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border: 1px solid #e7eef8;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #24324b;
}

.card-header span {
  font-size: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.metric-box {
  background: #f8fbff;
  border-radius: 18px;
  padding: 18px;
}

.metric-box.wide {
  grid-column: span 2;
}

.metric-label {
  display: block;
  color: #71829b;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-value {
  color: #172b4d;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.trend {
  color: #22c55e;
  font-size: 13px;
  font-weight: 700;
  margin-left: 6px;
}

.muted {
  color: #8a9bb3;
  font-size: 14px;
  font-weight: 500;
}

.progress {
  height: 7px;
  background: #eaf0f8;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

.progress-fill.blue {
  background: #4f7cff;
}

.progress-fill.green {
  background: #45c481;
}

.schedule-card {
  min-height: 350px;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px;
  background: #f8fbff;
  border-radius: 16px;
}

.schedule-time {
  min-width: 52px;
  color: #4f7cff;
  font-size: 14px;
  font-weight: 800;
}

.schedule-item h4 {
  margin: 0;
  font-size: 15px;
  color: #24324b;
  font-weight: 800;
}

.schedule-item p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8a9bb3;
  font-weight: 500;
}

.empty-schedule {
  height: 150px;
  display: grid;
  place-items: center;
  color: #8a9bb3;
  font-weight: 600;
}

.link-button {
  border: none;
  background: transparent;
  color: #4f7cff;
  font-size: 14px;
  font-weight: 800;
  margin-top: 18px;
  cursor: pointer;
}

.deadlines-card {
  grid-column: 1;
}

.deadline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deadline-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #eaf0f8;
  border-radius: 18px;
  background: #fff;
}

.alert-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff1f1;
  color: #f05252;
  font-weight: 900;
}

.deadline-info h4 {
  margin: 0;
  color: #24324b;
  font-size: 15px;
  font-weight: 800;
}

.deadline-info p {
  margin: 3px 0 0;
  color: #8a9bb3;
  font-size: 12px;
  font-weight: 500;
}

.deadline-date {
  margin-left: auto;
  color: #71829b;
  font-size: 13px;
  font-weight: 700;
}

.ai-banner {
  grid-column: 1;
  background: linear-gradient(135deg, #4f7cff 0%, #3456d1 100%);
  color: white;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 18px 36px rgba(79, 124, 255, 0.25);
  transition: 0.2s ease;
}

.ai-banner:hover {
  transform: translateY(-2px);
}

.ai-icon {
  font-size: 34px;
}

.ai-banner h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
}

.ai-banner p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

.ai-arrow {
  margin-left: auto;
  font-size: 26px;
  font-weight: 800;
}

.courses-card {
  grid-column: 1 / -1;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}

.course-card {
  background: #f8fbff;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #eef4fb;
}

.course-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.course-card h4 {
  margin: 0;
  color: #24324b;
  font-size: 15px;
  font-weight: 800;
}

.course-card p {
  margin: 8px 0 0;
  color: #8a9bb3;
  font-size: 12px;
  font-weight: 500;
}

.loading {
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: #71829b;
  font-weight: 700;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .deadlines-card,
  .ai-banner,
  .courses-card {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .content {
    width: calc(100% - 24px);
    padding: 20px 0;
  }

  .hero h1 {
    font-size: 24px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .metric-box.wide {
    grid-column: auto;
  }

  .card {
    padding: 18px;
    border-radius: 20px;
  }
}
</style>