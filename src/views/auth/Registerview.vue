<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth'

const router = useRouter()

// State Form Data
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(true) // State Checkbox

// State UI Tracking
const activeField = ref('') 
const isLoading = ref(false)
const errorMessage = ref('') 
const successMessage = ref('') 

// State Baru: Mengontrol Buka/Tutup Modal Terms
const isModalOpen = ref(false)

// Fungsi untuk menerima terms langsung dari dalam modal
const acceptProtocolsFromModal = () => {
  acceptTerms.value = true
  isModalOpen.value = false
}

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'ACCESS DENIED: Passwords do not match.'
    return
  }
  if (!acceptTerms.value) {
    errorMessage.value = 'ACCESS DENIED: You must acknowledge the terms.'
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const { status, data } = await authService.register({
      username: username.value,
      email: email.value,
      password: password.value
    })

    if (status === 201 && data.success) {
      successMessage.value = data.message
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } else {
      errorMessage.value = data.message || 'REGISTRATION_FAILED // Server refused query.'
    }

  } catch (error) {
    errorMessage.value = 'CONNECTION_FAILURE // Critical network timeout.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Form -->
    <div class="space-y-2 mb-6">
      <h1 class="font-display text-xl md:text-2xl font-bold text-on-surface uppercase tracking-tight">Initialize Account</h1>
      <p class="font-code text-xs text-on-surface-variant uppercase">Pure utility. Zero friction. Total control.</p>
    </div>

    <!-- Alert Banner -->
    <div v-if="errorMessage" class="mb-5 p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase tracking-wide">
      [ERROR]: {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="mb-5 p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase tracking-wide">
      [SUCCESS]: {{ successMessage }}
    </div>

    <!-- Form Utama -->
    <form class="flex flex-col gap-5" @submit.prevent="handleRegister">
      
      <!-- Field: Username -->
      <div class="space-y-2">
        <label 
          class="font-code text-xs uppercase transition-colors duration-200"
          :class="activeField === 'username' ? 'text-primary-container' : 'text-on-surface-variant'"
          for="username"
        >
          USERNAME
        </label>
        <div class="relative">
          <input 
            id="username"
            v-model="username"
            type="text" 
            placeholder="USER_01" 
            required
            :disabled="isLoading"
            @focus="activeField = 'username'"
            @blur="activeField = ''"
            class="w-full bg-[#1A1A1A] border border-[#333333] px-4 py-3 font-code text-sm text-on-surface placeholder:text-surface-variant transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Field: Email -->
      <div class="space-y-2">
        <label 
          class="font-code text-xs uppercase transition-colors duration-200"
          :class="activeField === 'email' ? 'text-primary-container' : 'text-on-surface-variant'"
          for="email"
        >
          EMAIL
        </label>
        <div class="relative">
          <input 
            id="email"
            v-model="email"
            type="email" 
            placeholder="OPERATOR@DOMAIN.COM" 
            required
            :disabled="isLoading"
            @focus="activeField = 'email'"
            @blur="activeField = ''"
            class="w-full bg-[#1A1A1A] border border-[#333333] px-4 py-3 font-code text-sm text-on-surface placeholder:text-surface-variant transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Grid Group: Password -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Password -->
        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200"
            :class="activeField === 'password' ? 'text-primary-container' : 'text-on-surface-variant'"
            for="password"
          >
            PASSWORD
          </label>
          <input 
            id="password"
            v-model="password"
            type="password" 
            placeholder="********" 
            required
            :disabled="isLoading"
            @focus="activeField = 'password'"
            @blur="activeField = ''"
            class="w-full bg-[#1A1A1A] border border-[#333333] px-4 py-3 font-code text-sm text-on-surface placeholder:text-surface-variant transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>

        <!-- Confirm Password -->
        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200"
            :class="activeField === 'confirm_password' ? 'text-primary-container' : 'text-on-surface-variant'"
            for="confirm_password"
          >
            CONFIRM PASSWORD
          </label>
          <input 
            id="confirm_password"
            v-model="confirmPassword"
            type="password" 
            placeholder="********" 
            required
            :disabled="isLoading"
            @focus="activeField = 'confirm_password'"
            @blur="activeField = ''"
            class="w-full bg-[#1A1A1A] border border-[#333333] px-4 py-3 font-code text-sm text-on-surface placeholder:text-surface-variant transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Checkbox Protocols (Perbaikan klik fungsional) -->
     <div class="flex items-start gap-3 mt-2 select-none">
      <!-- <p>{{ acceptTerms ? 'Checked' : 'Not checked' }}</p> -->
  <input 
  id="terms_checkbox"
  v-model="acceptTerms"
  type="checkbox" 
  :disabled="isLoading"
  class="
    mt-1 w-4 h-4 
    bg-transparent 
    /* Border saat tidak dicentang (Abu-abu terang agar terlihat) */
    border border-on-surface-variant/60 
    /* Warna tanda centang (Kita buat hitam agar kontras saat bg jadi hijau) */
    text-background 
    /* Hilangkan ring biru bawaan browser */
    focus:ring-0 focus:ring-offset-0 
    rounded-none cursor-pointer 
    disabled:opacity-50 
    /* Saat Dicentang */
    checked:bg-primary-container 
    checked:border-primary-container
  "
/>
  <label class="font-code text-[11px] leading-relaxed text-on-surface-variant cursor-pointer" for="terms_checkbox">
    I acknowledge the 
    <span @click.prevent="isModalOpen = true" class="text-primary-fixed-dim hover:underline underline-offset-2 font-bold mx-1 cursor-pointer">
      TERMS_OF_SERVICE
    </span> 
    and the data-handling protocols for high-performance link management.
  </label>
</div>

      <!-- CTA Button -->
      <button 
        type="submit"
        :disabled="isLoading"
        class="w-full bg-primary-container hover:brightness-110 active:scale-[0.98] transition-all text-[#000000] font-bold py-4 mt-2 font-code text-sm uppercase tracking-widest disabled:opacity-50 disabled:scale-100"
      >
        {{ isLoading ? 'CONNECTING TO VAULT...' : 'CREATE ACCOUNT' }}
      </button>
    </form>

    <!-- Footer Switching Link -->
    <div class="flex flex-col gap-4 border-t border-[#333333] mt-6 pt-6">
      <p class="font-code text-xs text-on-surface-variant text-center">
        ALREADY REGISTERED? 
        <router-link to="/auth/login" class="text-primary-fixed-dim hover:underline ml-1">
          SYSTEM_LOGIN
        </router-link>
      </p>
    </div>

    <!-- ================= MODAL TERMS OF SERVICE ================= -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="w-full max-w-lg bg-[#141414] border-2 border-outline-variant p-6 flex flex-col gap-4 shadow-2xl relative">
        
        <!-- Header Modal -->
        <div class="flex justify-between items-center border-b border-[#333333] pb-3">
          <div class="flex items-center gap-2 text-primary-fixed-dim font-display font-bold text-sm tracking-widest">
            <span class="material-symbols-outlined text-sm">gavel</span> LNK_SHRT // TERMS_OF_SERVICE
          </div>
          <button @click="isModalOpen = false" class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">
            close
          </button>
        </div>

        <!-- Isi Dokumen Hukum Terminal (Scrollable) -->
        <div class="font-code text-xs text-on-surface-variant max-h-[250px] overflow-y-auto space-y-4 pr-2 text-left custom-scrollbar leading-relaxed">
          <p class="text-primary-container font-bold">[PROTOCOL_01: ZERO_TRACKING_POLICY]</p>
          <p>We do not store, track, or sell end-user behavioral patterns or personally identifiable information (PII). All routing metrics are processed ephemerally at the memory edge layer.</p>
          
          <p class="text-primary-container font-bold">[PROTOCOL_02: MALWARE_SCANNING]</p>
          <p>By creating short links on this platform, you grant permission to our automated shield system to parse the target destination URL for phishing patterns, high-risk malware scripts, and security vulnerabilities.</p>
          
          <p class="text-primary-container font-bold">[PROTOCOL_03: INFRASTRUCTURE_USAGE]</p>
          <p>Spamming links, creating loops, or deploying automated scrapers to jam the network layer will result in immediate termination of account access tokens.</p>
        </div>

        <!-- Footer Tombol Modal -->
        <div class="flex justify-end gap-3 border-t border-[#333333] pt-4 mt-2 font-code text-xs">
          <button 
            @click="isModalOpen = false" 
            class="px-4 py-2.5 border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all uppercase"
          >
            DECLINE
          </button>
          <button 
            @click="acceptProtocolsFromModal" 
            class="px-5 py-2.5 bg-primary-container text-black font-bold hover:brightness-110 active:scale-95 transition-all uppercase tracking-wider"
          >
            ACCEPT_PROTOCOLS
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
input {
  -webkit-appearance: none;
  border-radius: 0;
}

/* Kustom scrollbar kecil khusus untuk area text di dalam modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0e0e0e;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333333;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #00ff00;
}
</style>