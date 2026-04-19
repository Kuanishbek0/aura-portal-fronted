import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import HomePage from '../pages/HomePage.vue'
import AiAssistantPage from '../pages/AiAssistantPage.vue'
import PerformancePage from '../pages/PerformancePage.vue'
import SchedulePage from '../pages/SchedulePage.vue'
import GradebookPage from '../pages/GradebookPage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import DocumentsPage from '../pages/DocumentsPage.vue'
import ProfilePage from '../pages/ProfilePage.vue' 

// === 1. ИМПОРТИРУЙ НОВЫЕ СТРАНИЦЫ ===
import ForgotPassword from '../pages/ForgotPassword.vue'
import ResetPassword from '../pages/ResetPassword.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const token = localStorage.getItem('token')
      return token ? '/home' : '/login'
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },

  // === 2. ДОБАВЬ ЭТИ МАРШРУТЫ ===
  // Они должны быть БЕЗ requiresAuth, чтобы студент мог зайти на них, не логинясь
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
  },

  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/ai',
    name: 'ai',
    component: AiAssistantPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/performance',
    name: 'performance',
    component: PerformancePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: SchedulePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/gradebook',
    name: 'gradebook',
    component: GradebookPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/courses',
    name: 'courses',
    component: CoursesPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/documents',
    name: 'documents',
    component: DocumentsPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if ((to.path === '/login' || to.path === '/register') && token) {
    next('/home')
    return
  }

  next()
})

export default router