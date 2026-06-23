import router from '../router' // Pastikan path relative ke router Vue kamu benar
import { useAuthStore } from '../stores/auth' // Pastikan path relative ke Pinia store benar

/**
 * Core API Client Wrapper yang bertindak sebagai Global Interceptor
 * @param {string} endpoint - Alamat URL API (Contoh: '/api/v1/urls')
 * @param {Object} options - Konfigurasi fetch (method, headers, body, dll)
 */
export const apiClient = async (endpoint, options = {}) => {
  // 1. Ambil token terbaru dari localStorage
  const token = localStorage.getItem('user_token')
  const tokenType = localStorage.getItem('token_type') || 'Bearer'

  // 2. Satukan konfigurasi headers secara otomatis
  const headers = {
    'Accept': 'application/json',
    ...options.headers
  }

  // Jika token ditemukan, suntikkan secara otomatis ke Authorization Header
  if (token) {
    headers['Authorization'] = `${tokenType} ${token}`
  }

  const config = {
    ...options,
    headers
  }

  try {
    // 3. Eksekusi Request HTTP
    const response = await fetch(endpoint, config)

    // ================= GLOBAL RESPONSE INTERCEPTOR =================
    if (response.status === 401) {
      console.warn('CRITICAL // [401_UNAUTHORIZED]: Session has expired or token is invalid. Evicting data layer...')
      
      // Bersihkan state autentikasi lokal
      const authStore = useAuthStore()
      authStore.clearAuth()

      // Tendang user langsung kembali ke gerbang login
      router.push('/auth/login')
      
      // Kembalikan objek eror terstruktur agar fungsi penemu API tidak crash
      return { 
        status: 401, 
        data: { success: false, message: 'SESSION_EXPIRED // Silakan login kembali.' } 
      }
    }

    // Jika response kosongan (misal status 204 No Content), cegah eror .json()
    if (response.status === 204) {
      return { status: response.status, data: null }
    }

    const data = await response.json()
    return { status: response.status, data }

  } catch (error) {
    console.error('NETWORK_CRASH // Communication with backend nodes disrupted:', error)
    throw error;
  }
}