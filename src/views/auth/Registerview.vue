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
      console.log('Registration failed:', data);
      errorMessage.value = data?.errors?.password ||data?.message || 'REGISTRATION_FAILED // Server refused query.'
    }

  } catch (error) {
    errorMessage.value = 'CONNECTION_FAILURE // Critical network timeout.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center px-4 md:px-6 py-12">
    
    <div class="w-full max-w-md bg-[#161616] border border-outline-variant p-6 md:p-8 shadow-2xl relative">
      
      <div class="space-y-2 mb-6 text-center">
        <h1 class="font-display text-xl md:text-2xl font-bold text-on-surface uppercase tracking-tight">Initialize Account</h1>
        <p class="font-code text-[11px] text-on-surface-variant uppercase tracking-wider">Pure utility. Zero friction. Total control.</p>
        <div class="h-1 w-12 bg-primary-container mx-auto mt-2"></div>
      </div>

      <div v-if="errorMessage" class="mb-5 p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase tracking-wide text-left animate-in fade-in duration-200">
        [ERROR]: {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-5 p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase tracking-wide text-left animate-in fade-in duration-200">
        [SUCCESS]: {{ successMessage }}
      </div>

      <form class="flex flex-col gap-4 text-left" @submit.prevent="handleRegister">
        
        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200 tracking-widest"
            :class="activeField === 'username' ? 'text-primary-container' : 'text-on-surface-variant'"
            for="username"
          >
            USERNAME
          </label>
          <input 
            id="username"
            v-model="username"
            type="text" 
            placeholder="USER_01" 
            required
            :disabled="isLoading"
            @focus="activeField = 'username'"
            @blur="activeField = ''"
            class="w-full bg-[#1e1e1e] border border-outline px-4 py-3 font-code text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50 outline-none"
          />
        </div>

        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200 tracking-widest"
            :class="activeField === 'email' ? 'text-primary-container' : 'text-on-surface-variant'"
            for="email"
          >
            EMAIL
          </label>
          <input 
            id="email"
            v-model="email"
            type="email" 
            placeholder="OPERATOR@DOMAIN.COM" 
            required
            :disabled="isLoading"
            @focus="activeField = 'email'"
            @blur="activeField = ''"
            class="w-full bg-[#1e1e1e] border border-outline px-4 py-3 font-code text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50 outline-none"
          />
        </div>

        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200 tracking-widest"
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
            class="w-full bg-[#1e1e1e] border border-outline px-4 py-3 font-code text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50 outline-none"
          />
        </div>

        <div class="space-y-2">
          <label 
            class="font-code text-xs uppercase transition-colors duration-200 tracking-widest"
            :class="activeField === 'confirm_password' ? 'text-primary-container' : 'text-on-surface-variant'"
            for="confirm_password"
          >
            CONFIRM_PASSWORD
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
            class="w-full bg-[#1e1e1e] border border-outline px-4 py-3 font-code text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:border-primary-container focus:ring-0 rounded-none disabled:opacity-50 outline-none"
          />
        </div>

        <div class="flex items-start gap-3 mt-2 select-none">
          <input 
            id="terms_checkbox"
            v-model="acceptTerms"
            type="checkbox" 
            :disabled="isLoading"
            class="mt-1 w-4 h-4 bg-transparent border border-on-surface-variant/60 text-background focus:ring-0 focus:ring-offset-0 rounded-none cursor-pointer disabled:opacity-50 checked:bg-primary-container checked:border-primary-container"
          />
          <label class="font-code text-[11px] leading-relaxed text-on-surface-variant cursor-pointer" for="terms_checkbox">
            I acknowledge the 
            <span @click.prevent="isModalOpen = true" class="text-primary-fixed-dim hover:underline underline-offset-2 font-bold mx-1 cursor-pointer">
              TERMS_OF_SERVICE
            </span> 
            and the data-handling protocols for high-performance link management.
          </label>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-container hover:brightness-110 active:scale-[0.98] transition-all text-[#000000] font-code font-extrabold py-3.5 mt-2 text-sm uppercase tracking-widest disabled:opacity-50 disabled:scale-100 rounded-none whitespace-nowrap"
        >
          {{ isLoading ? 'CONNECTING TO VAULT...' : 'CREATE ACCOUNT' }}
        </button>
      </form>

      <div class="flex flex-col gap-4 border-t border-outline-variant/20 mt-6 pt-5">
        <p class="font-code text-xs text-on-surface-variant text-center tracking-wide">
          ALREADY REGISTERED? 
          <router-link to="/auth/login" class="text-primary-fixed-dim hover:underline ml-1 font-bold">
            SYSTEM_LOGIN
          </router-link>
        </p>
      </div>

    </div>

    <div class="mt-6 font-code text-[11px] text-on-surface-variant/40 uppercase tracking-widest">
      SECURE_ACCESS_LAYER // v2.4.0
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="w-full max-w-lg bg-[#141414] border-2 border-outline-variant p-6 flex flex-col gap-4 shadow-2xl relative">
        
        <div class="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <div class="flex items-center gap-2 text-primary-fixed-dim font-display font-bold text-sm tracking-widest">
            <span class="material-symbols-outlined text-sm">gavel</span> LNK_SHRT // TERMS_OF_SERVICE
          </div>
          <button @click="isModalOpen = false" class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">
            close
          </button>
        </div>

        <div class="font-code text-xs text-on-surface-variant max-h-[250px] overflow-y-auto space-y-4 pr-2 text-left custom-scrollbar leading-relaxed">
          <p class="text-primary-container font-bold">[PROTOCOL_01: ZERO_TRACKING_POLICY]</p>
          <p>We do not store, track, or sell end-user behavioral patterns or personally identifiable information (PII). All routing metrics are processed ephemerally at the memory edge layer.</p>
          
          <p class="text-primary-container font-bold">[PROTOCOL_02: MALWARE_SCANNING]</p>
          <p>By creating short links on this platform, you grant permission to our automated shield system to parse the target destination URL for phishing patterns, high-risk malware scripts, and security vulnerabilities.</p>
          
          <p class="text-primary-container font-bold">[PROTOCOL_03: INFRASTRUCTURE_USAGE]</p>
          <p>Spamming links, creating loops, or deploying automated scrapers to jam the network layer will result in immediate termination of account access tokens.</p>
        </div>

        <div class="flex justify-end gap-3 border-t border-outline-variant/30 pt-4 mt-2 font-code text-xs">
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