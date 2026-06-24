import router from '../router'
import { useAuthStore } from '../stores/auth'

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('user_token')
  const tokenType = localStorage.getItem('token_type') || 'Bearer'

  const headers = {
    'Accept': 'application/json',
    ...options.headers
  }

  // REVISI: Token HANYA disuntikkan jika ada token DAN tidak ada instruksi skipAuth
  if (token && !options.skipAuth) {
    headers['Authorization'] = `${tokenType} ${token}`
  }

  const config = {
    ...options,
    headers
  }

  // Hapus properti skipAuth kustom agar tidak ikut terkirim ke fungsi fetch asli
  delete config.skipAuth

  try {
    const response = await fetch(endpoint, config)

    if (response.status === 401) {
      console.warn('CRITICAL // [401_UNAUTHORIZED]: Session expired. Evicting data layer...')
      const authStore = useAuthStore()
      authStore.clearAuth()
      router.push('/auth/login')
      return { status: 401, data: { success: false, message: 'SESSION_EXPIRED' } }
    }

    if (response.status === 204) {
      return { status: response.status, data: null }
    }

    const data = await response.json()
    return { status: response.status, data }

  } catch (error) {
    console.error('NETWORK_CRASH:', error)
    throw error;
  }
}