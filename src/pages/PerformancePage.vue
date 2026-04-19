<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="status-banner">
        <div class="banner-header">
          <div class="check-icon">✓</div>
          <div class="banner-text">
            <h3>{{ text[lang].statusTitle }}</h3>
            <p>{{ text[lang].goodStanding }}</p>
          </div>
          <div class="ribbon-icon">🎗️</div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="label">GPA</span>
            <span class="value">3.87</span>
          </div>
          <div class="stat-item">
            <span class="label">{{ text[lang].rating }}</span>
            <span class="value">12 {{ text[lang].outOf }} 156</span>
          </div>
          <div class="stat-item">
            <span class="label">{{ text[lang].credits }}</span>
            <span class="value green">✓ {{ text[lang].plan }}</span>
          </div>
        </div>
      </div>

      <div class="section-card chart-section">
        <div class="section-header">
          <h3>{{ text[lang].chartTitle }}</h3>
          <span class="trend-icon">📈</span>
        </div>
        <div class="chart-container">
          <Line :data="getChartData()" :options="chartOptions" />
        </div>
        <div class="chart-legend">
          <div class="legend-item"><span class="dot blue"></span> {{ text[lang].studyHours }}</div>
          <div class="legend-item"><span class="dot green"></span> {{ text[lang].avgScore }}</div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>{{ text[lang].gradesTitle }}</h3>
          <span class="icon">📋</span>
        </div>
        <div class="grades-list">
          <div v-for="grade in getLocalizedGrades()" :key="grade.subject" class="grade-row">
            <div class="grade-info">
              <span class="subject-name">{{ grade.subject }}</span>
              <div class="grade-details">
                <span :class="['grade-badge', grade.colorClass]">{{ grade.mark }}</span>
                <span class="ects">{{ grade.ects }} ECTS</span>
              </div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: grade.percent + '%', background: grade.hex }"></div>
              </div>
              <span class="percent-text">{{ grade.percent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>{{ text[lang].examsTitle }}</h3>
          <span class="icon">📅</span>
        </div>
        <div class="exams-list">
          <div v-for="exam in getLocalizedExams()" :key="exam.subject" class="exam-item">
            <div class="exam-info">
              <h4>{{ exam.subject }}</h4>
              <p>{{ exam.type }}</p>
            </div>
            <span class="exam-date">{{ exam.date }}</span>
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

// Импорты для графиков
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

import { useLang } from '@/composables/useLang' // ПОДКЛЮЧАЕМ ЯЗЫК

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const { lang } = useLang()
const sidebarOpen = ref(false)

// СЛОВАРЬ ПЕРЕВОДОВ
const text = {
  ru: {
    statusTitle: 'Текущий академический статус',
    goodStanding: 'Отличная успеваемость',
    rating: 'Рейтинг',
    outOf: 'из',
    credits: 'Кредиты',
    plan: 'План',
    chartTitle: 'Динамика успеваемости',
    studyHours: 'Учебные часы',
    avgScore: 'Средний балл',
    week: 'Нед',
    gradesTitle: 'Текущие оценки',
    examsTitle: 'Предстоящие экзамены',
    db: 'Базы данных',
    web: 'Веб-технологии',
    math: 'Математический анализ',
    algo: 'Алгоритмы и структуры данных',
    midterm: 'Рубежный контроль',
    practiceExam: 'Практический экзамен',
    march5: '5 марта',
    march8: '8 марта'
  },
  kk: {
    statusTitle: 'Ағымдағы академиялық статус',
    goodStanding: 'Үздік үлгерім',
    rating: 'Рейтинг',
    outOf: '/',
    credits: 'Кредиттер',
    plan: 'Жоспар',
    chartTitle: 'Үлгерім динамикасы',
    studyHours: 'Оқу сағаттары',
    avgScore: 'Орташа балл',
    week: 'Апта',
    gradesTitle: 'Ағымдағы бағалар',
    examsTitle: 'Алдағы емтихандар',
    db: 'Деректер қоры',
    web: 'Веб-технологиялар',
    math: 'Математикалық анализ',
    algo: 'Алгоритмдер және деректер құрылымы',
    midterm: 'Аралық бақылау',
    practiceExam: 'Тәжірибелік емтихан',
    march5: '5 наурыз',
    march8: '8 наурыз'
  },
  en: {
    statusTitle: 'Current Academic Status',
    goodStanding: 'Excellent standing',
    rating: 'Rating',
    outOf: 'of',
    credits: 'Credits',
    plan: 'Plan',
    chartTitle: 'Performance Dynamics',
    studyHours: 'Study hours',
    avgScore: 'Average score',
    week: 'Wk',
    gradesTitle: 'Current Grades',
    examsTitle: 'Upcoming Exams',
    db: 'Databases',
    web: 'Web Technologies',
    math: 'Mathematical Analysis',
    algo: 'Algorithms and Data Structures',
    midterm: 'Midterm Control',
    practiceExam: 'Practical Exam',
    march5: 'March 5',
    march8: 'March 8'
  }
}

// Данные для графика (оборачиваем в функцию, чтобы реагировали на язык)
const getChartData = () => {
  return {
    labels: [`${text[lang.value].week} 1`, `${text[lang.value].week} 2`, `${text[lang.value].week} 3`, `${text[lang.value].week} 4`, `${text[lang.value].week} 5`],
    datasets: [
      {
        label: text[lang.value].studyHours,
        borderColor: '#4f7cff',
        backgroundColor: '#4f7cff',
        data: [12.5, 15.2, 11.8, 18.1, 16.5],
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: text[lang.value].avgScore,
        borderColor: '#48bb78',
        backgroundColor: '#48bb78',
        data: [4, 4, 4, 4, 4],
        tension: 0,
        pointRadius: 4,
      }
    ]
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
  }
}

// Данные для оценок
const getLocalizedGrades = () => [
  { subject: text[lang.value].db, mark: 'A', ects: 5, percent: 78, colorClass: 'a', hex: '#4f7cff' },
  { subject: text[lang.value].web, mark: 'A-', ects: 4, percent: 85, colorClass: 'a-minus', hex: '#48bb78' },
  { subject: text[lang.value].math, mark: 'B+', ects: 6, percent: 72, colorClass: 'b-plus', hex: '#667eea' },
  { subject: text[lang.value].algo, mark: 'A', ects: 5, percent: 90, colorClass: 'a', hex: '#4f7cff' }
]

// Данные для экзаменов
const getLocalizedExams = () => [
  { subject: text[lang.value].db, type: text[lang.value].midterm, date: text[lang.value].march5 },
  { subject: text[lang.value].web, type: text[lang.value].practiceExam, date: text[lang.value].march8 }
]
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 16px; max-width: 900px; margin: 0 auto; transition: all 0.3s ease; }
@media (max-width: 600px) { .content { max-width: 100%; padding: 12px; } .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .stat-item:last-child { grid-column: span 2; } .chart-container { height: 160px !important; } }
@media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
.status-banner { background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.banner-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.check-icon { background: #f0fff4; color: #48bb78; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.banner-text h3 { font-size: 15px; color: #1a202c; margin: 0; }
.banner-text p { font-size: 13px; color: #718096; margin: 0; }
.stats-grid { display: grid; gap: 12px; }
.stat-item { background: #f8fafc; padding: 12px; border-radius: 16px; text-align: left; border: 1px solid transparent; transition: border 0.2s; }
.stat-item:hover { border-color: #e2e8f0; }
.stat-item .label { font-size: 11px; color: #718096; display: block; }
.stat-item .value { font-size: 16px; font-weight: 700; color: #2d3748; }
.stat-item .value.green { color: #48bb78; }
.chart-section { padding: 20px; }
.chart-container { height: 220px; margin: 10px 0; }
.chart-legend { display: flex; gap: 15px; justify-content: center; margin-top: 10px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.blue { background: #4f7cff; }
.dot.green { background: #48bb78; }
.section-card { background: white; border-radius: 24px; padding: 20px; margin-bottom: 20px; border: 1px solid #eef2f7; transition: transform 0.2s ease; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.section-header h3 { font-size: 16px; font-weight: 700; color: #2d3748; }
.grade-row { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f7fafc; }
.grade-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.subject-name { font-weight: 600; font-size: 14px; color: #2d3748; }
.grade-details { display: flex; gap: 8px; align-items: center; }
.grade-badge { padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.grade-badge.a { background: #ebf4ff; color: #4f7cff; }
.grade-badge.a-minus { background: #f0fff4; color: #48bb78; }
.grade-badge.b-plus { background: #fff5f5; color: #f56565; }
.ects { font-size: 12px; color: #a0aec0; }
.progress-container { display: flex; align-items: center; gap: 10px; }
.progress-bar { flex: 1; height: 6px; background: #edf2f7; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; transition: width 0.8s cubic-bezier(0.1, 0.7, 0.1, 1); }
.percent-text { font-size: 12px; color: #718096; min-width: 35px; }
.exam-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 14px; border-radius: 16px; margin-bottom: 10px; }
.exam-info h4 { font-size: 14px; margin: 0; color: #2d3748; }
.exam-info p { font-size: 12px; margin: 0; color: #a0aec0; }
.exam-date { color: #4f7cff; background: white; padding: 6px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; border: 1px solid #e2e8f0; }
</style>