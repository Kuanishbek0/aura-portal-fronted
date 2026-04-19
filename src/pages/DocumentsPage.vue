<template>
  <div class="page">
    <AppHeader @toggle-sidebar="sidebarOpen = true" />
    <Sidebar v-model="sidebarOpen" />

    <main class="content">
      <h2>Документы</h2>

      <div class="card">Справка об обучении</div>
      <div class="card">Транскрипт</div>
      <div class="card">Индивидуальный учебный план</div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import BottomNav from '@/components/BottomNav.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
  padding-bottom: 70px;
}
.content {
  padding: 16px;
}
.card {
  background: white;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 16px;
}
</style>
