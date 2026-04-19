<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <div class="page-header">
        <h2>{{ text[lang].title }} 🎓</h2>
        <div class="gpa-badge">
          {{ text[lang].totalGpa }}: <span>3.87</span>
        </div>
      </div>

      <div class="semesters-list">
        <div class="semester-block">
          <div class="semester-header">
            <h3>6 {{ text[lang].semester }}</h3>
            <span class="credits-total">20 ECTS</span>
          </div>

          <div class="grades-table">
            <div class="table-header">
              <div class="col-subject">{{ text[lang].subject }}</div>
              <div class="col-credits">ECTS</div>
              <div class="col-grade">{{ text[lang].grade }}</div>
            </div>

            <div v-for="(grade, idx) in getGrades()" :key="idx" class="table-row">
              <div class="col-subject">
                <h4>{{ grade.name }}</h4>
                <p>{{ grade.type }}</p>
              </div>
              <div class="col-credits">{{ grade.credits }}</div>
              <div class="col-grade">
                <div class="grade-score">
                  <span class="num">{{ grade.num }}</span>
                  <span class="letter" :class="grade.color">{{ grade.letter }}</span>
                </div>
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
    title: 'Зачетная книжка', totalGpa: 'Итоговый GPA', semester: 'Семестр', subject: 'Дисциплина', grade: 'Оценка',
    subj1: 'Full-stack разработка', subj2: 'Разработка ИИ-интерфейсов', subj3: 'Мобильные приложения',
    exam: 'Экзамен', project: 'Проект'
  },
  kk: {
    title: 'Сынақ кітапшасы', totalGpa: 'Қорытынды GPA', semester: 'Семестр', subject: 'Пән', grade: 'Баға',
    subj1: 'Full-stack әзірлеу', subj2: 'ЖИ-интерфейстерін әзірлеу', subj3: 'Мобильді қосымшалар',
    exam: 'Емтихан', project: 'Жоба'
  },
  en: {
    title: 'Gradebook', totalGpa: 'Total GPA', semester: 'Semester', subject: 'Subject', grade: 'Grade',
    subj1: 'Full-stack Development', subj2: 'AI Interfaces Development', subj3: 'Mobile Applications',
    exam: 'Exam', project: 'Project'
  }
}

const getGrades = () => [
  { name: text[lang.value].subj1, type: text[lang.value].exam, credits: 5, num: 95, letter: 'A', color: 'green' },
  { name: text[lang.value].subj2, type: text[lang.value].project, credits: 6, num: 98, letter: 'A+', color: 'green' },
  { name: text[lang.value].subj3, type: text[lang.value].exam, credits: 5, num: 88, letter: 'B+', color: 'blue' }
]
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }
.content { padding: 20px; max-width: 900px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
.page-header h2 { font-size: 24px; color: #1f2937; margin: 0; }
.gpa-badge { background: #1f2937; color: white; padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 500; }
.gpa-badge span { color: #48bb78; font-weight: 700; font-size: 18px; margin-left: 6px; }

.semester-block { background: white; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); overflow: hidden; margin-bottom: 30px; }
.semester-header { background: #f8fafc; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
.semester-header h3 { margin: 0; font-size: 16px; color: #1f2937; font-weight: 700; }
.credits-total { font-size: 13px; color: #64748b; font-weight: 600; background: white; padding: 4px 10px; border-radius: 8px; border: 1px solid #e2e8f0; }

.grades-table { display: flex; flex-direction: column; }
.table-header { display: flex; padding: 12px 24px; background: white; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.table-row { display: flex; padding: 16px 24px; border-bottom: 1px solid #f8fafc; align-items: center; transition: background 0.2s; }
.table-row:hover { background: #fcfcfc; }
.table-row:last-child { border-bottom: none; }

.col-subject { flex: 3; }
.col-subject h4 { margin: 0 0 4px 0; font-size: 15px; color: #1f2937; }
.col-subject p { margin: 0; font-size: 12px; color: #64748b; }

.col-credits { flex: 1; text-align: center; font-size: 14px; font-weight: 600; color: #475569; }

.col-grade { flex: 1; display: flex; justify-content: flex-end; }
.grade-score { display: flex; align-items: center; gap: 10px; }
.grade-score .num { font-size: 16px; font-weight: 700; color: #1f2937; }
.grade-score .letter { padding: 4px 10px; border-radius: 8px; font-size: 14px; font-weight: 700; }
.letter.green { background: #f0fff4; color: #10b981; }
.letter.blue { background: #ebf2ff; color: #4f7cff; }

@media (max-width: 600px) {
  .table-header { display: none; }
  .table-row { flex-wrap: wrap; position: relative; padding: 16px; gap: 10px; }
  .col-subject { flex: 100%; }
  .col-credits { display: none; } /* На телефоне скрываем ECTS для чистоты */
  .col-grade { position: absolute; right: 16px; top: 16px; }
}
</style>