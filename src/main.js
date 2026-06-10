import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // Pastikan file CSS Tailwind kamu di-import di sini

const app = createApp(App)

app.use(router) // Mengaktifkan rute di Vue

app.mount('#app')