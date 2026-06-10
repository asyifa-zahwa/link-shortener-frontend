<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth' // <--- Import service terpusat

const router = useRouter()

// State Form Data
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

// State UI Tracking
const activeField = ref('') 
const isLoading = ref(false)
const errorMessage = ref('') 
const successMessage = ref('') 

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'ACCESS DENIED: Passwords do not match.'
    return
  }
  if (!acceptTerms.value) return

  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Konsumsi service API terpusat dengan melempar payload rapi
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
    <div class="space-y-2 mb-6">
      <h1 class="font-display text-xl md:text-2xl font-bold text-on-surface uppercase tracking-tight">Initialize Account</h1>
      <p class="font-code text-xs text-on-surface-variant uppercase">Pure utility. Zero friction. Total control.</p>
    </div>

    <div v-if="errorMessage" class="mb-5 p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase tracking-wide">
      [ERROR]: {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="mb-5 p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase tracking-wide">
      [SUCCESS]: {{ successMessage }}
    </div>

    <form class="flex flex-col gap-5" @submit.prevent="handleRegister">
      
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      <div class="flex items-start gap-3 mt-2">
        <input 
          id="terms"
          v-model="acceptTerms"
          type="checkbox" 
          required
          :disabled="isLoading"
          class="mt-1 w-4 h-4 bg-transparent border-outline border text-primary-container focus:ring-0 rounded-none cursor-pointer disabled:opacity-50"
        />
        <label class="font-code text-[11px] leading-relaxed text-on-surface-variant cursor-pointer select-none" for="terms">
          I acknowledge the <a class="text-primary-fixed-dim hover:underline" href="#">TERMS_OF_SERVICE</a> and the data-handling protocols for high-performance link management.
        </label>
      </div>

      <button 
        type="submit"
        :disabled="isLoading"
        class="w-full bg-primary-container hover:brightness-110 active:scale-[0.98] transition-all text-[#000000] font-bold py-4 mt-2 font-code text-sm uppercase tracking-widest disabled:opacity-50 disabled:scale-100"
      >
        {{ isLoading ? 'CONNECTING TO VAULT...' : 'CREATE ACCOUNT' }}
      </button>
    </form>

    <div class="flex flex-col gap-4 border-t border-[#333333] mt-6 pt-6">
      <p class="font-code text-xs text-on-surface-variant text-center">
        ALREADY REGISTERED? 
        <router-link to="/auth/login" class="text-primary-fixed-dim hover:underline ml-1">
          SYSTEM_LOGIN
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
input {
  -webkit-appearance: none;
  border-radius: 0;
}
</style>