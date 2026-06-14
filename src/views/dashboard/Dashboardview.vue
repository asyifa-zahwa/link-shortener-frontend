<script setup>
import { ref, computed, onMounted } from 'vue'
import { urlService } from '../../services/url' // Import service URL terpusat

// State Form Generator (Menggunakan nama variabel asli kamu)
const originalUrl = ref('')
const customAlias = ref('')
const expiryDate = ref('')
const isGenerating = ref(false)

// State Data dari API Backend
const links = ref([])
const pageInfo = ref({
  currentPage: 0,
  totalItems: 0,
  totalPages: 1
})

// State UI Tracking
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const copiedId = ref(null)

// Menghitung total entri secara dinamis untuk UI asli kamu
const totalEntries = computed(() => pageInfo.value.totalItems)

// Fungsi mengambil data dari API Backend
const fetchMyLinks = async (page = 0) => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { status, data } = await urlService.getMyUrls(page, 10)
    
    if (status === 200 && data.success) {
      links.value = data.data
      pageInfo.value = data.pageInfo
    } else {
      errorMessage.value = 'FETCH_ERROR // Failed to synchronize repository.'
    }
  } catch (error) {
    errorMessage.value = 'NETWORK_ERROR // Protocol timeout.'
  } finally {
    isLoading.value = false
  }
}

// Fungsi membuat Short Link Baru via API Backend (Placeholder siap pakai)
// Fungsi membuat Short Link Baru via API Backend asli
const handleShortenLink = async () => {
  if (!originalUrl.value) return
  
  isGenerating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // 1. Transformasi format tanggal jika diisi oleh user
  let formattedExpiry = null
  if (expiryDate.value) {
    // Mengubah YYYY-MM-DD menjadi YYYY-MM-DDT23:59:59Z sesuai spek API
    formattedExpiry = `${expiryDate.value}T23:59:59Z`
  }

  // 2. Susun Payload sesuai spek dari Backend
  const payload = {
    longUrl: originalUrl.value,
    customAlias: customAlias.value || null, // Kirim null jika dikosongkan
    expiredAt: formattedExpiry
  }

  try {
    // 3. Tembak API menggunakan service
    const { status, data } = await urlService.shortenUrl(payload)
    
    if (status === 201 && data.success) {
      // Tampilkan feedback sukses dari message backend
      successMessage.value = `LINK_GENERATED // ${data.message}`
      
      // Reset Form Input seperti semula
      originalUrl.value = ''
      customAlias.value = ''
      expiryDate.value = ''
      
      // Refresh isi tabel ke halaman awal agar link barunya langsung kelihatan
      await fetchMyLinks(0)
    } else {
      // Tangani error respons terstruktur (seperti status 400 alias terpakai, 401, atau 429)
      errorMessage.value = data.error || 'GENERATION_FAILED // Invalid request parameters.'
    }
  } catch (error) {
    // Tangani jika terjadi gangguan jaringan atau server mati
    errorMessage.value = 'COMPILER_CRASH // Communication with edge nodes failed.'
  } finally {
    isGenerating.value = false
  }
}

// Ambil data dari server begitu dashboard dimuat
onMounted(() => {
  fetchMyLinks()
})

// Fungsi salin teks ke clipboard dengan efek reaktivitas asli kamu (menggunakan shortCode/id)
const copyToClipboard = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 1500)
  })
}

// Helper: Membaca status kedaluwarsa link dari data backend jika dibutuhkan
const checkStatus = (link) => {
  // Jika backend tidak mengirim field status, kita fallback ke 'Active'
  return link.status || 'Active'
}

// Helper: Format tanggal agar serasi dengan layout aslimu (ISO string ke YYYY-MM-DD)
const formatDate = (dateStr) => {
  if (!dateStr) return 'NEVER'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}
</script>

<template>
  <div class="space-y-10">
    
    <section>
      <div class="flex items-center gap-3 mb-4">
        <span class="w-1 h-6 bg-primary-container"></span>
        <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Generate_New_Link</h2>
      </div>
      
      <div class="bg-surface-container-low border border-outline-variant p-6 md:p-8">
        <div v-if="successMessage" class="mb-4 p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase">
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
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="w-1 h-6 bg-primary-container"></span>
          <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Active_Repository</h2>
        </div>
        <div class="flex items-center gap-4 text-on-surface-variant font-code text-xs">
          <span>TOTAL_ENTRIES: {{ String(totalEntries).padStart(2, '0') }}</span>
          <button class="material-symbols-outlined text-lg hover:text-primary-fixed-dim">filter_list</button>
        </div>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 border border-red-500 text-red-500 font-code text-xs uppercase">
        [ERROR]: {{ errorMessage }}
      </div>

      <div class="overflow-x-auto border border-outline-variant bg-surface-container-lowest custom-scrollbar relative">
        <div v-if="isLoading" class="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center font-code text-xs text-primary-container">
          LOADING_REPOSITORY_DATA...
        </div>

        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-surface-container-high font-code text-xs text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">
              <th class="px-6 py-4 font-medium">Link_Identity</th>
              <th class="px-6 py-4 font-medium">Engagement</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium">Expiry</th>
              <th class="px-6 py-4 font-medium text-right">Utility</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            
            <tr 
              v-for="link in links" 
              :key="link.shortCode" 
              class="hover:bg-surface-container/40 transition-colors group"
              :class="checkStatus(link) === 'Expired' ? 'opacity-50' : ''"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col max-w-xs md:max-w-md">
                  <span class="font-code text-sm font-bold text-primary-fixed-dim mb-0.5">{{ link.shortUrl }}</span>
                  <span class="text-on-surface-variant font-code text-xs truncate" :title="link.longUrl">
                    {{ link.longUrl }}
                  </span>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2 font-code text-sm font-bold text-on-surface">
                  <span class="material-symbols-outlined text-sm text-primary-fixed-dim">ads_click</span>
                  {{ link.totalClicks.toLocaleString() }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-0.5 border font-code text-[10px] uppercase font-bold tracking-wider"
                  :class="checkStatus(link) === 'Active' ? 'border-primary-fixed-dim text-primary-fixed-dim' : 'border-on-secondary-container text-on-secondary-container'"
                >
                  {{ checkStatus(link) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-code text-xs text-on-surface-variant">{{ formatDate(link.createdAt) }}</span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-end gap-1">
                  <button 
                    @click="copyToClipboard(link.shortUrl, link.shortCode)"
                    class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded"
                    title="Copy Link"
                  >
                    <span class="material-symbols-outlined text-base">
                      {{ copiedId === link.shortCode ? 'check_circle' : 'content_copy' }}
                    </span>
                  </button>
                  
                  <button class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded" title="Edit Link">
                    <span class="material-symbols-outlined text-base">edit</span>
                  </button>
                  
                  <button 
                    class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-error transition-all rounded"
                    title="Delete Link"
                  >
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="links.length === 0 && !isLoading">
              <td colspan="5" class="px-6 py-10 text-center font-code text-sm text-on-surface-variant">
                NO_REPOSITORIES_FOUND // DATA_LAYER_EMPTY
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 font-code text-xs">
        <span class="text-on-surface-variant">
          SHOWING_PAGE_{{ pageInfo.currentPage + 1 }}_OF_{{ pageInfo.totalPages }}
        </span>
        <div class="flex gap-2 w-full sm:w-auto">
          <button 
            @click="fetchMyLinks(pageInfo.currentPage - 1)"
            :disabled="pageInfo.currentPage === 0 || isLoading"
            class="flex-1 sm:flex-initial px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all active:scale-95 disabled:opacity-30 disabled:scale-100"
          >
            PREV
          </button>
          <button 
            @click="fetchMyLinks(pageInfo.currentPage + 1)"
            :disabled="(pageInfo.currentPage + 1) >= pageInfo.totalPages || isLoading"
            class="flex-1 sm:flex-initial px-4 py-2 border border-primary-container text-primary-container bg-primary-container/10 transition-all active:scale-95 disabled:opacity-30 disabled:scale-100"
          >
            NEXT
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.invert-date-icon::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>