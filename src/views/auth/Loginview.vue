<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State reaktif untuk menampung input kredensial user
const username = ref('')
const password = ref('')
const isLoading = ref(false)

// Fungsi handle login simulasi sebelum integrasi backend
const handleLogin = () => {
  if (!username.value || !password.value) return
  
  isLoading.value = true
  
  // Simulasi delay loading infrastruktur keamanan selama 1 detik
  setTimeout(() => {
    isLoading.value = false
    console.log('Access Granted for:', username.value)
    
    // Alihkan user masuk ke dalam halaman dashboard utama setelah sukses
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h1 class="font-display text-xl md:text-2xl font-bold text-on-surface uppercase mb-2">Access Control</h1>
      <div class="h-1 w-12 bg-primary-container mx-auto"></div>
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
            class="w-full bg-surface-container text-on-surface border border-outline px-4 py-3 font-code text-sm placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0"
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
            class="w-full bg-surface-container text-on-surface border border-outline px-4 py-3 font-code text-sm placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0"
          />
        </div>
      </div>

      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-primary-container text-on-primary font-display text-base font-extrabold py-4 transition-all active:scale-95 hover:brightness-110 uppercase tracking-tighter disabled:opacity-50 disabled:scale-100"
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
/* Reset style shadow bawaan iOS mobile browser pada input tag */
input {
  -webkit-appearance: none;
  border-radius: 0;
}
</style>