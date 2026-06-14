// Service khusus untuk manajemen URL
export const urlService = {
  /**
   * Mengambil daftar link milik user dengan pagination
   * @param {number} page - Halaman ke berapa (start from 0)
   * @param {number} size - Berapa data per halaman
   */
  async getMyUrls(page = 0, size = 10) {
    const token = localStorage.getItem('user_token');
    
    try {
      const response = await fetch(`/api/v1/my-urls?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      return {
        status: response.status,
        data: data
      };
    } catch (error) {
      console.error('URL Service Fetch Error:', error);
      throw error;
    }
  },

  /**
   * Mengirim request pembuatan short link baru
   * @param {Object} payload - { longUrl, customAlias, expiredAt }
   */
  async shortenUrl(payload) {
    const token = localStorage.getItem('user_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Pasang header Authorization secara opsional jika token tersedia
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch('/api/v1/urls', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error('URL Service Shorten Error:', error);
      throw error;
    }
  },
  /**
   * Mengirim request pembuatan short link baru untuk GUEST (Tanpa Login)
   * @param {Object} payload - { longUrl }
   */
  async shortenUrlAsGuest(payload) {
    try {
      const response = await fetch('/api/v1/urls/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return {
        status: response.status,
        data: data
      };
    } catch (error) {
      console.error('URL Service Guest Shorten Error:', error);
      throw error;
    }
  }
};