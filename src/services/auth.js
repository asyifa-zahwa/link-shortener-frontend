// Centralized Authentication API Service

export const authService = {
  /**
   * Mengirim data registrasi user baru ke backend
   * @param {Object} payload - { username, email, password }
   * @returns {Promise<Object>} Response data dari server
   */
  async register(payload) {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      // Kembalikan objek berekstensi status agar view bisa membaca HTTP Status Code
      return {
        status: response.status,
        data: data
      }
    } catch (error) {
      console.error('API Service Register Error:', error)
      throw error // Lemparkan error ke komponen penembak agar bisa ditangani di UI
    }
  },

  /**
   * Mengirim data kredensial login ke backend
   * @param {Object} payload - { username, password }
   * @returns {Promise<Object>} Response data berisi accessToken
   */
  async login(payload) {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      return {
        status: response.status,
        data: data
      }
    } catch (error) {
      console.error('API Service Login Error:', error)
      throw error
    }
  },

  /**
   * Mengirim request deaktivasi token (Logout) ke backend resmi
   * @returns {Promise<Object>} Status HTTP dan data response
   */
  async logout() {
    const token = localStorage.getItem('user_token')
    const tokenType = localStorage.getItem('token_type') || 'Bearer'

    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          // Menyertakan token JWT agar Spring Boot tahu token mana yang harus dablacklist
          'Authorization': `${tokenType} ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      return {
        status: response.status,
        data: data
      }
    } catch (error) {
      console.error('API Service Logout Error:', error)
      throw error
    }
  }
}