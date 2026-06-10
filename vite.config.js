import { defineConfig } from 'vite'
import vue from '@vitejs/vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Jika mendeteksi request diawali dengan '/api', belokkan ke server backend utama
      '/api': {
        target: 'http://localhost:8080', // <--- Ganti port ini sesuai port backend aslimu
        changeOrigin: true,
        secure: false,
      }
    }
  }
})