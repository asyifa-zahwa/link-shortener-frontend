<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// State untuk menampung input URL dari user
const longUrl = ref('')

// State reaktif untuk simulasi dashboard teknis (Latency per detik)
const latency = ref(14)
let latencyInterval = null

// Fungsi aksi saat tombol SHORTEN ditekan
const handleShorten = () => {
  if (!longUrl.value) return
  console.log('URL yang akan dipendekkan:', longUrl.value)
  // Tempat menaruh integrasi API kamu nantinya
}

// Siklus hidup komponen untuk menjalankan simulasi metrik
onMounted(() => {
  latencyInterval = setInterval(() => {
    // Simulasi fluktuasi latency jaringan antara 12ms - 18ms
    latency.value = Math.floor(Math.random() * (18 - 12 + 1) + 12)
  }, 3000)
})

// Membersihkan interval saat user pindah halaman agar memori optimal
onUnmounted(() => {
  if (latencyInterval) clearInterval(latencyInterval)
})
</script>

<template>
  <div class="space-y-16">
    
    <section class="max-w-[1200px] mx-auto px-6 md:px-12 mt-8 md:mt-12">
      <div class="flex flex-col items-center text-center space-y-6">
        
        <h1 class="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight">
          Shorten Your Link <span class="text-primary-fixed-dim">Instantly</span>
        </h1>
        
        <p class="font-body text-sm md:text-base lg:text-lg text-on-surface-variant max-w-2xl">
          High-performance link infrastructure for technical teams. No tracking, zero cookies, enterprise-grade reliability.
        </p>

        <div class="w-full max-w-3xl mt-6 md:mt-10 relative group">
          <div class="flex flex-col md:flex-row gap-0 border border-outline bg-surface-container-low focus-within:border-primary-container transition-all duration-300">
            
            <div class="flex-grow flex items-center px-4 md:px-6 py-4">
              <span class="material-symbols-outlined text-on-surface-variant mr-4">link</span>
              <input 
                v-model="longUrl"
                type="text" 
                placeholder="PASTE YOUR LONG URL HERE..." 
                class="bg-transparent border-none focus:ring-0 w-full font-code text-xs md:text-sm text-on-surface placeholder-on-tertiary-container outline-none uppercase tracking-widest"
              />
            </div>
            
            <button 
              @click="handleShorten"
              class="bg-primary-container text-on-primary-container font-code text-xs md:text-sm px-8 md:px-10 py-4 md:py-5 font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              SHORTEN
            </button>
          </div>

          <div class="flex flex-wrap justify-between gap-2 mt-4 font-code text-[11px] md:text-xs text-on-tertiary-container px-2">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span> 
              SYSTEM: OPTIMAL
            </span>
            <span>LATENCY: {{ latency }}MS</span>
            <span>NODES: 412 ACTIVE</span>
          </div>
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
/* Mematikan highlight bawaan mobile browser saat input aktif */
input:focus {
  outline: none;
}
</style>