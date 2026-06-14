<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { urlService } from '../services/url' // Import service URL terpusat

// State asli bawaan kamu
const longUrl = ref('')
const latency = ref(14)
let latencyInterval = null

// State Tambahan untuk Integrasi API Guest
const isCompiling = ref(false)
const generatedResult = ref(null)
const errorMessage = ref('')
const isCopied = ref(false)

// Fungsi aksi saat tombol SHORTEN ditekan (Kini terhubung penuh ke API Backend)
const handleShorten = async () => {
  if (!longUrl.value) return
  
  isCompiling.value = true
  errorMessage.value = ''
  generatedResult.value = null
  isCopied.value = false

  try {
    const { status, data } = await urlService.shortenUrlAsGuest({
      longUrl: longUrl.value
    })

    // Mendukung status HTTP 200 atau 201 sesuai spesifikasi backend-mu
    if ((status === 200 || status === 201) && data.shortUrl) {
      generatedResult.value = data     // Berisi { longUrl, shortUrl, shortCode }
      longUrl.value = ''               // Reset field input utama seperti aslinya
    } else {
      errorMessage.value = data.error || 'GENERATION_FAILED // Uplink rejected data block.'
    }
  } catch (error) {
    errorMessage.value = 'NETWORK_CRASH // Communication with compiler layer failed.'
  } finally {
    isCompiling.value = false
  }
}

// Fungsi menyalin link hasil generate tamu
const copyGuestLink = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 2000)
  })
}

// Siklus hidup komponen asli kamu untuk menjalankan simulasi metrik latency
onMounted(() => {
  latencyInterval = setInterval(() => {
    latency.value = Math.floor(Math.random() * (18 - 12 + 1) + 12)
  }, 3000)
})

// Membersihkan interval asli kamu saat pindah halaman
onUnmounted(() => {
  if (latencyInterval) clearInterval(latencyInterval)
})
</script>

<template>
  <div class="space-y-16">
    
    <section class="max-w-[1200px] mx-auto px-6 md:px-12 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col items-center text-center space-y-6">
        
        <h1 class="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight uppercase">
          Shorten Your Link <span class="text-primary-fixed-dim">Instantly</span>
        </h1>
        
        <p class="font-body text-sm md:text-base lg:text-lg text-on-surface-variant max-w-2xl">
          High-performance link infrastructure for technical teams. No tracking, zero cookies, enterprise-grade reliability.
        </p>

        <div v-if="errorMessage" class="w-full max-w-3xl p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase tracking-wide text-left animate-in fade-in duration-300">
          [SYSTEM_ERROR]: {{ errorMessage }}
        </div>

        <div class="w-full max-w-3xl mt-6 md:mt-10 relative group">
          <div class="flex flex-col md:flex-row gap-0 border border-outline bg-surface-container-low focus-within:border-primary-container transition-all duration-300">
            
            <div class="flex-grow flex items-center px-4 md:px-6 py-4">
              <span class="material-symbols-outlined text-on-surface-variant mr-4">link</span>
              <input 
                v-model="longUrl"
                type="url" 
                :disabled="isCompiling"
                placeholder="PASTE YOUR LONG URL HERE..." 
                class="bg-transparent border-none focus:ring-0 w-full font-code text-xs md:text-sm text-on-surface placeholder-on-tertiary-container outline-none uppercase tracking-widest disabled:opacity-50"
              />
            </div>
            
            <button 
              @click="handleShorten"
              :disabled="isCompiling || !longUrl"
              class="bg-primary-container text-black font-code text-xs md:text-sm px-8 md:px-10 py-4 md:py-5 font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 uppercase"
            >
              {{ isCompiling ? 'COMPILING...' : 'SHORTEN' }}
            </button>
          </div>

          <div class="flex flex-wrap justify-between gap-2 mt-4 font-code text-[11px] md:text-xs text-on-tertiary-container px-2">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span> 
              SYSTEM: {{ isCompiling ? 'PROCESSING' : 'OPTIMAL' }}
            </span>
            <span>LATENCY: {{ latency }}MS</span>
            <span>NODES: 412 ACTIVE</span>
          </div>
        </div>

        <div 
          v-if="generatedResult" 
          class="w-full max-w-3xl bg-surface-container border-2 border-primary-container p-5 mt-6 text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div class="flex items-center gap-2 text-primary-container font-code text-xs font-bold uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">check_circle</span> LINK_COMPILED_SUCCESSFULLY
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background border border-outline-variant p-4">
            <div class="flex flex-col gap-1 overflow-hidden w-full">
              <span class="font-code text-sm md:text-base font-bold text-primary-fixed-dim selection:bg-primary-container/30">
                {{ generatedResult.shortUrl }}
              </span>
              <span class="text-on-surface-variant font-code text-[11px] truncate max-w-full" :title="generatedResult.longUrl">
                ORIGINAL: {{ generatedResult.longUrl }}
              </span>
            </div>

            <button 
              @click="copyGuestLink(generatedResult.shortUrl)"
              class="w-full sm:w-auto px-5 py-2.5 font-code text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
              :class="isCopied ? 'bg-green-950 text-green-400 border border-green-500' : 'bg-surface-variant text-on-surface hover:brightness-110 border border-outline-variant'"
            >
              <span class="material-symbols-outlined text-sm">
                {{ isCopied ? 'done' : 'content_copy' }}
              </span>
              {{ isCopied ? 'COPIED!' : 'COPY' }}
            </button>
          </div>
          <p class="font-code text-[10px] text-on-surface-variant/50 uppercase">
            * NOTICE: Guest links are completely anonymous and do not track click metrics. Create an account for permanent data storage.
          </p>
        </div>

      </div>
    </section>

    <section class="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div class="md:col-span-8 bg-surface-container border border-outline-variant p-6 flex flex-col justify-between group hover:border-primary-container transition-colors relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary-fixed-dim text-lg">dns</span>
              <span class="font-code text-xs text-primary-fixed-dim">NETWORK LAYER</span>
            </div>
            <h3 class="font-display text-lg md:text-xl lg:text-2xl font-bold mb-4 uppercase tracking-wide">Enterprise Grade Infrastructure</h3>
            <p class="font-body text-xs md:text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Global edge distribution ensures your links resolve in milliseconds, regardless of where your users are located. Redundant architecture with 99.99% uptime SLA.
            </p>
          </div>
          <div class="mt-8 flex gap-4 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity font-code text-[10px] md:text-xs">
            <div class="border border-outline p-2 whitespace-nowrap">SHARD_01 ACTIVE</div>
            <div class="border border-outline p-2 whitespace-nowrap">SHARD_02 ACTIVE</div>
            <div class="border border-outline p-2 whitespace-nowrap class hidden sm:block">SHARD_03 STANDBY</div>
          </div>
        </div>

        <div class="md:col-span-4 bg-surface-container border border-outline-variant p-6 flex flex-col justify-between hover:border-primary-container transition-colors">
          <div class="mb-6">
            <span class="material-symbols-outlined text-primary-fixed-dim mb-4 block">shield</span>
            <h3 class="font-display text-base md:text-lg font-bold uppercase mb-2">Safe Links</h3>
            <p class="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Automatic malware scanning and phishing detection on every short URL created.
            </p>
          </div>
          <div class="border-t border-outline-variant pt-4">
            <div class="flex justify-between items-center font-code text-xs">
              <span class="text-on-tertiary-container">SCAN_STATUS</span>
              <span class="text-primary-fixed-dim font-bold">PROTECTED</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-5 bg-surface-container border border-outline-variant p-6 hover:border-primary-container transition-colors">
          <span class="material-symbols-outlined text-primary-fixed-dim mb-4 block">cookie_off</span>
          <h3 class="font-display text-base md:text-lg font-bold uppercase mb-2">Zero Cookies</h3>
          <p class="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Privacy first. We don't track your users or store personally identifiable information. No cookie banners required.
          </p>
        </div>

        <div class="md:col-span-7 bg-surface-container-highest border border-outline-variant p-6 hover:border-primary-container transition-colors group">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="material-symbols-outlined text-primary-fixed-dim mb-4 block">api</span>
              <h3 class="font-display text-base md:text-lg font-bold uppercase mb-2">Powerful API</h3>
            </div>
            <div class="font-code text-[11px] text-primary-fixed-dim bg-background px-2 py-1 border border-primary-fixed-dim">v2.4.0</div>
          </div>
          <div class="bg-black p-4 border border-outline-variant font-code text-xs text-on-surface-variant mb-4 group-hover:text-primary-fixed-dim transition-colors overflow-x-auto">
            <p class="text-primary-fixed-dim font-bold mb-1">POST /v2/shorten</p>
            <p class="text-on-tertiary-container">{ "url": "https://enterprise.internal/data" }</p>
          </div>
          <p class="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Integrate LNK_SHRT into your existing workflow with our robust REST API and webhooks.
          </p>
        </div>

      </div>
    </section>

    <section class="max-w-[1200px] mx-auto px-6 md:px-12 pb-8">
      <div class="relative h-[200px] md:h-[350px] w-full bg-surface-container-lowest border border-outline-variant overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none"></div>
        
        <div class="relative z-10 text-center space-y-3 px-4">
          <h2 class="font-display text-lg md:text-2xl lg:text-3xl font-bold uppercase tracking-[0.25em]">Data Persistence Layer</h2>
          <p class="font-code text-[10px] md:text-xs text-primary-fixed-dim tracking-widest">IMMUTABLE | DISTRIBUTED | ENCRYPTED</p>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
input:focus {
  outline: none;
}
</style>