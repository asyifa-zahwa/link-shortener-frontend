import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const token = ref(localStorage.getItem('user_token') || null)
  const tokenType = ref(localStorage.getItem('token_type') || 'Bearer')
  
  // Hanya simpan username untuk kebutuhan visual nama di topbar dashboard
  const username = ref(localStorage.getItem('user_username') || '')

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value)
  const currentUsername = computed(() => username.value)

  // --- ACTIONS ---
  // Fungsi ini dipanggil saat login berhasil di Loginview.vue
  const saveLoginData = (accessToken, type, user) => {
    token.value = accessToken
    tokenType.value = type
    username.value = user

    localStorage.setItem('user_token', accessToken)
    localStorage.setItem('token_type', type)
    localStorage.setItem('user_username', user) // Simpan agar saat F5 nama ga hilang
  }

  // Fungsi ini dipanggil saat tombol logout ditekan
  const clearAuth = () => {
    token.value = null
    tokenType.value = 'Bearer'
    username.value = ''
    
    localStorage.removeItem('user_token')
    localStorage.removeItem('token_type')
    localStorage.removeItem('user_username')
  }

  return {
    token,
    tokenType,
    username,
    isAuthenticated,
    currentUsername,
    saveLoginData,
    clearAuth
  }
})