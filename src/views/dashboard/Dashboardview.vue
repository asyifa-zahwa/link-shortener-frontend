<script setup>
import { ref, computed, onMounted } from 'vue'
import { urlService } from '../../services/url'

// State Form Generator
const originalUrl = ref('')
const customAlias = ref('')
const expiryDate = ref('')
const isGenerating = ref(false)

// State Data Ringkas
const recentLinks = ref([])

// State UI Tracking
const isLoading = ref(false)
const isInitialLoading = ref(true) // LOCK SCREEN DI AWAL
const errorMessage = ref('')
const successMessage = ref('')
const copiedId = ref(null)

// --- VALIDASI KALENDER DINAMIS ---
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const today = new Date()
  today.setMonth(today.getMonth() + 1)
  return today.toISOString().split('T')[0]
})

// Mengambil 3 data link terbaru dari server
const fetchRecentLinks = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { status, data } = await urlService.getMyUrls(0, 3)
    if (status === 200 && data.success) {
      recentLinks.value = data.data
    }
  } catch (error) {
    console.error('Failed to sync recent references:', error)
  } {
    isLoading.value = false
    isInitialLoading.value = false // BUKA LOCK SCREEN SETELAH API MERESPONS
  }
}

// Fungsi membuat Short Link Baru via API Backend
const handleShortenLink = async () => {
  if (!originalUrl.value) return
  
  isGenerating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  let formattedExpiry = null
  if (expiryDate.value) {
    formattedExpiry = `${expiryDate.value}T23:59:59Z`
  }

  const payload = {
    longUrl: originalUrl.value,
    customAlias: customAlias.value || null,
    expiredAt: formattedExpiry
  }

  try {
    const { status, data } = await urlService.shortenUrl(payload)
    
    if (status === 201 && data.success) {
      successMessage.value = `LINK_GENERATED // ${data.message} -> ${data.data.shortUrl}`
      originalUrl.value = ''
      customAlias.value = ''
      expiryDate.value = ''
      await fetchRecentLinks()
    } else {
      errorMessage.value = data.error || 'GENERATION_FAILED // Invalid request parameters.'
    }
  } catch (error) {
    errorMessage.value = 'COMPILER_CRASH // Communication with edge nodes failed.'
  } finally {
    isGenerating.value = false
  }
}

onMounted(() => {
  fetchRecentLinks()
})

const copyToClipboard = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => { copiedId.value = null }, 1500)
  })
}
</script>

<template>
  <div class="relative min-h-[60vh]">
    
    <div 
      v-if="isInitialLoading" 
      class="absolute inset-0 bg-background z-50 flex flex-col items-center justify-center gap-4 font-code text-xs text-primary-container animate-in fade-in duration-200"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-base animate-spin">sync</span>
        <span class="tracking-widest uppercase">Verifying_Node_Security_Tokens...</span>
      </div>
      <div class="text-[10px] text-on-surface-variant/40">SECURE_ACCESS_LAYER // SYNCING_REPOSITORIES</div>
    </div>

    <div v-else class="space-y-10 animate-in fade-in duration-300">
      
      <section>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1 h-6 bg-primary-container"></span>
          <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Generate_New_Link</h2>
        </div>
        
        <div class="bg-surface-container-low border border-outline-variant p-6 md:p-8">
          <div v-if="successMessage" class="mb-6 p-4 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase tracking-wide break-all text-left">
            [SUCCESS]: {{ successMessage }}
          </div>

          <form @submit.prevent="handleShortenLink" class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div class="md:col-span-5 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">ORIGINAL_URL</label>
              <input 
                v-model="originalUrl"
                type="url" 
                placeholder="https://very-long-destination-url.com/path" 
                required
                :disabled="isGenerating"
                class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none"
              />
            </div>

            <div class="md:col-span-3 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">CUSTOM_ALIAS</label>
              <input 
                v-model="customAlias"
                type="text" 
                placeholder="my-custom-path" 
                :disabled="isGenerating"
                class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none"
              />
            </div>

            <div class="md:col-span-2 flex flex-col gap-2">
              <label class="font-code text-xs text-on-surface-variant uppercase">EXPIRY_DATE</label>
              <input 
                v-model="expiryDate"
                type="date" 
                :min="minDate"
                :max="maxDate"
                :disabled="isGenerating"
                class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none text-white invert-date-icon"
              />
            </div>

            <div class="md:col-span-2 flex items-end">
              <button 
                type="submit"
                :disabled="isGenerating || !originalUrl"
                class="w-full bg-primary-container text-on-primary-container font-display font-bold py-3.5 hover:brightness-110 active:scale-95 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
              >
                {{ isGenerating ? 'COMPILING...' : 'SHORTEN' }}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1 h-6 bg-primary-container"></span>
          <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Recent_Reference_Nodes (03)</h2>
        </div>

        <div class="border border-outline-variant bg-surface-container-lowest relative">
          <div v-if="isLoading" class="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center font-code text-xs text-primary-container">
            SYNCING_RECENT_DATA...
          </div>

          <div class="divide-y divide-outline-variant">
            <div v-for="link in recentLinks" :key="link.shortCode" class="p-4 flex justify-between items-center hover:bg-surface-container/30 transition-colors">
              <div class="flex flex-col max-w-xl text-left overflow-hidden pr-4">
                <span class="font-code text-sm font-bold text-primary-fixed-dim select-all">{{ link.shortUrl }}</span>
                <span class="text-on-surface-variant font-code text-xs truncate" :title="link.longUrl">{{ link.longUrl }}</span>
              </div>
              
              <button 
                @click="copyToClipboard(link.shortUrl, link.shortCode)"
                class="p-2.5 bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all flex items-center gap-2 font-code text-xs"
              >
                <span class="material-symbols-outlined text-sm">
                  {{ copiedId === link.shortCode ? 'check_circle' : 'content_copy' }}
                </span>
                <span>{{ copiedId === link.shortCode ? 'COPIED' : 'COPY' }}</span>
              </button>
            </div>

            <div v-if="recentLinks.length === 0 && !isLoading" class="p-8 text-center font-code text-sm text-on-surface-variant">
              NO_RECENT_GENERATIONS // NODE_HISTORY_EMPTY
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.invert-date-icon::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>