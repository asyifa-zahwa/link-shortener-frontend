<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth' // Import service terpusat
import { useAuthStore } from '../../stores/auth' // Import Pinia store untuk auth

const router = useRouter()
const authStore = useAuthStore()

// State Form Data
const username = ref('')
const password = ref('')

// State UI Tracking
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    // Panggil service login dengan mengirimkan payload data
    const { status, data } = await authService.login({
      username: username.value,
      password: password.value
    })

    // Jika login sukses (200 OK) dan server mengembalikan token
    if (status === 200 && data.accessToken) {
      
      const loggedInUser = username.value
      
  
      // Simpan data sekaligus ke Pinia & LocalStorage
      authStore.saveLoginData(data.accessToken, data.tokenType, loggedInUser)
      
      console.log('Access Granted. System Token Saved.')
      
      // Alihkan user langsung masuk ke ruang rahasia dashboard
      router.push('/dashboard')
    } else {
      // Tangani jika backend menolak kredensial (misal salah password/username)
      errorMessage.value = data.message || 'ACCESS_DENIED // Invalid security credentials.'
    }

  } catch (error) {
    // Tangani jika server backend mati atau masalah jaringan
    errorMessage.value = 'CONNECTION_FAILURE // Critical authentication timeout.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h1 class="font-display text-xl md:text-2xl font-bold text-on-surface uppercase mb-2">Access Control</h1>
      <div class="h-1 w-12 bg-primary-container mx-auto"></div>
    </div>

    <div v-if="errorMessage" class="mb-5 p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase tracking-wide">
      [AUTH_ERROR]: {{ errorMessage }}
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      
      <div class="flex flex-col gap-2">
        <label class="font-code text-xs font-medium text-on-surface-variant uppercase tracking-widest" for="username">
          USERNAME
        </label>
        <div class="relative">
          <input 
            id="username"
            v-model="username"
            type="text" 
            autocomplete="username" 
            placeholder="root@system" 
            required
            :disabled="isLoading"
            class="w-full bg-surface-container text-on-surface border border-outline px-4 py-3 font-code text-sm placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-code text-xs font-medium text-on-surface-variant uppercase tracking-widest" for="password">
          PASSWORD
        </label>
        <div class="relative">
          <input 
            id="password"
            v-model="password"
            type="password" 
            autocomplete="current-password" 
            placeholder="••••••••••••" 
            required
            :disabled="isLoading"
            class="w-full bg-surface-container text-on-surface border border-outline px-4 py-3 font-code text-sm placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>
      </div>

      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-primary-container text-on-primary font-display text-base font-extrabold py-4 transition-all active:scale-95 hover:brightness-110 uppercase tracking-tighter disabled:opacity-50 disabled:scale-100 text-black"
        >
          {{ isLoading ? 'INITIALIZING ACCESS...' : 'LOGIN' }}
        </button>
      </div>
    </form>

    <div class="mt-6 flex flex-col gap-4">
      <div class="flex justify-between items-center font-code text-xs">
        <a href="#" class="text-on-surface-variant hover:text-primary-fixed-dim transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary-fixed-dim">
          LOST ACCESS?
        </a>
        <router-link to="/auth/register" class="text-on-surface-variant hover:text-primary-fixed-dim transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary-fixed-dim">
          REGISTER
        </router-link>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-4">
      <span class="text-[10px] font-code text-on-surface-variant/50 uppercase">
        Secured by LNK_SHRT_VAULT
      </span>
      <div class="flex gap-1">
        <div class="w-1.5 h-1.5 bg-outline-variant"></div>
        <div class="w-1.5 h-1.5 bg-outline-variant"></div>
        <div class="w-1.5 h-1.5 bg-primary-container animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  -webkit-appearance: none;
  border-radius: 0;
}
</style>