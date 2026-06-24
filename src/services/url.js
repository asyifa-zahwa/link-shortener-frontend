import { apiClient } from './apiClient'

// Service khusus untuk manajemen URL - Terintegrasi dengan Global Interceptor
export const urlService = {
  /**
   * Mengambil daftar link milik user dengan pagination & filter pencarian kustom
   */
  async getMyUrls(page = 0, size = 15, search = '') {
    let url = `/api/v1/my-urls?page=${page}&size=${size}`
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search.trim())}`
    }
    
    // Tinggal panggil apiClient, token dan header diurus otomatis di dalam
    return await apiClient(url, { method: 'GET' })
  },

  /**
   * Mengirim request pembuatan short link baru
   */
  async shortenUrl(payload) {
    return await apiClient('/api/v1/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  },

  /**
   * Memusnahkan data link secara permanen
   */
  async deleteUrl(shortCode) {
    return await apiClient(`/api/v1/urls/${shortCode}`, {
      method: 'DELETE'
    })
  },

  /**
   * Mengambil metrik data analitik spesifik
   */
  async getUrlAnalytics(shortCode) {
    return await apiClient(`/api/v1/urls/${shortCode}/analytics`, {
      method: 'GET'
    })
  },
  
  /**
   * MENGEMBALIKAN FITUR: Pembuatan short link baru khusus TAMU/GUEST (BARU & BERSIH)
   * @param {Object} payload - { longUrl: "https://..." }
   */
  async shortenUrlGuest(payload) {
    return await apiClient('/api/v1/urls/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      skipAuth: true // Instruksi khusus agar apiClient TIDAK menyisipkan token Bearer
    })
  },


}