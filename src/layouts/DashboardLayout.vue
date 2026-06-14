<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/auth'

const router = useRouter()
const authStore = useAuthStore()

// State untuk Kontrol Kustom Modal & Alert
const isConfirmOpen = ref(false)
const isSubmitting = ref(false)
const notification = ref({
  show: false,
  type: 'success', // 'success' atau 'error'
  message: ''
})

// Fungsi untuk memicu kemunculan banner notifikasi kustom
const triggerNotification = (type, msg) => {
  notification.value = { show: true, type, message: msg }
  // Otomatis menutup banner dalam 3.5 detik
  setTimeout(() => {
    notification.value.show = false
  }, 3500)
}

// Buka dialog konfirmasi kustom
const openLogoutConfirm = () => {
  isConfirmOpen.value = true
}

// Eksekusi pemutusan koneksi (Logout)
const executeLogout = async () => {
  isSubmitting.value = true
  try {
    const { status, data } = await authService.logout()

    if (status === 200 && data.success) {
      triggerNotification('success', `DEACTIVATION_SUCCESS // ${data.message}`)
      
      // Beri jeda 1.5 detik agar user bisa melihat animasi sukses sebelum pindah rute
      setTimeout(() => {
        finalizeLogout()
      }, 1500)
    } else {
      triggerNotification('error', 'LOGOUT_REJECTED // Session anomalies detected.')
      setTimeout(() => finalizeLogout(), 2000)
    }
  } catch (error) {
    triggerNotification('error', 'LINK_FAILURE // Failed to sync with authentication core.')
    setTimeout(() => finalizeLogout(), 2000)
  }
}

// Bersihkan data lokal dan lempar ke login page
const finalizeLogout = () => {
  isConfirmOpen.value = false
  isSubmitting.value = false
  authStore.clearAuth()
  router.push('/auth/login')
}
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen antialiased font-body flex flex-col md:flex-row relative">
    
    <div 
      v-if="notification.show" 
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md border p-4 font-code text-xs uppercase tracking-wide shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4"
      :class="notification.type === 'success' 
        ? 'bg-green-950/90 border-primary-container text-primary-container' 
        : 'bg-red-950/90 border-red-500 text-red-400'"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-sm animate-pulse">
          {{ notification.type === 'success' ? 'terminal' : 'gpp_maybe' }}
        </span>
        <div>{{ notification.message }}</div>
      </div>
    </div>

    <div 
      v-if="isConfirmOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div class="bg-surface-container-low border-2 border-outline-variant w-full max-w-md p-6 md:p-8 space-y-6 relative rounded-none shadow-2xl">
        <div class="flex justify-between items-center border-b border-outline-variant/40 pb-3 text-on-surface-variant font-code text-[11px]">
          <span>SYSTEM_PROMPT // SECURITY_CORE</span>
          <span class="text-error animate-pulse">● LNK_SHRT</span>
        </div>

        <div class="space-y-2">
          <h3 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">TERMINATE_SESSION?</h3>
          <p class="font-code text-xs text-on-surface-variant leading-relaxed">
            Tindakan ini akan menghancurkan token enkripsi lokal dan memutuskan sambungan data aman Anda dari node utama. Apakah Anda yakin?
          </p>
        </div>

        <div class="flex gap-4 font-code text-xs pt-2">
          <button 
            @click="isConfirmOpen = false" 
            :disabled="isSubmitting"
            class="flex-1 border border-outline text-on-surface hover:bg-surface-variant py-3 transition-all rounded-none uppercase font-bold disabled:opacity-40"
          >
            CANCEL_REQ
          </button>
          <button 
            @click="executeLogout" 
            :disabled="isSubmitting"
            class="flex-1 bg-red-600 text-white hover:bg-red-500 py-3 transition-all rounded-none uppercase font-bold active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting" class="material-symbols-outlined text-sm animate-spin">sync</span>
            {{ isSubmitting ? 'DISCONNECTING...' : 'CONFIRM_LOGOUT' }}
          </button>
        </div>
      </div>
    </div>

    <aside class="hidden md:flex flex-col w-64 bg-background border-r border-outline-variant min-h-screen fixed left-0 top-0 z-30 p-6 justify-between">
      <div class="space-y-8">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-fixed-dim">link</span>
          <span class="font-display text-xl font-bold tracking-tighter text-primary-fixed-dim">LNK_SHRT</span>
        </div>

        <nav class="flex flex-col gap-2">
          <router-link to="/dashboard" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
            <span class="material-symbols-outlined text-lg">dashboard</span> DASHBOARD
          </router-link>
          <router-link to="/dashboard/my-links" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
            <span class="material-symbols-outlined text-lg">list</span> MY LINKS
          </router-link>
          <router-link to="/dashboard/analytics" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
            <span class="material-symbols-outlined text-lg">analytics</span> ANALYTICS
          </router-link>
        </nav>
      </div>

      <button 
        @click="openLogoutConfirm" 
        class="flex items-center gap-3 font-code text-sm px-4 py-3 text-error hover:bg-surface-variant transition-colors w-full text-left"
      >
        <span class="material-symbols-outlined text-lg">logout</span> LOGOUT
      </button>
    </aside>

    <div class="flex-grow md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0">
      
      <header class="bg-background/80 backdrop-blur-md md:bg-background border-b border-outline-variant px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div class="flex items-center gap-2 md:hidden">
          <span class="font-display font-bold text-primary-fixed-dim tracking-tighter">LNK_SHRT</span>
        </div>
        <div class="font-code text-xs text-on-surface-variant hidden md:block">
          SYSTEM_STATUS: <span class="text-primary-container">ONLINE</span>
        </div>
        
        <div class="flex items-center gap-2 font-code text-xs uppercase">
          <span class="material-symbols-outlined text-sm">account_circle</span> 
          {{ authStore.username || 'GUEST_NODE' }}
        </div>
      </header>

      <main class="p-4 md:p-8 flex-grow max-w-[1200px] w-full mx-auto">
        <router-view />
      </main>
    </div>

    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 bg-background border-t border-outline-variant md:hidden shadow-lg">
      <router-link to="/dashboard" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">dashboard</span>
      </router-link>
      <router-link to="/dashboard/my-links" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">list</span>
      </router-link>
      <router-link to="/dashboard/analytics" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">analytics</span>
      </router-link>
      
      <button 
        @click="openLogoutConfirm" 
        class="text-error opacity-70 flex flex-col items-center justify-center focus:outline-none"
      >
        <span class="material-symbols-outlined">logout</span>
      </button>
    </nav>

  </div>
</template>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>