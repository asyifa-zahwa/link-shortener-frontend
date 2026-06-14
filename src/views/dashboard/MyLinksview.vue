<script setup>
import { ref, computed, onMounted } from 'vue'
import { urlService } from '../../services/url'

const links = ref([])
const pageInfo = ref({
  currentPage: 0,
  totalItems: 0,
  totalPages: 1
})

// State UI Tracking & Notifikasi
const isLoading = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const copiedId = ref(null)

// State Kustom Modal Delete
const isDeleteModalOpen = ref(false)
const targetDeleteCode = ref('')

const totalEntries = computed(() => pageInfo.value.totalItems)

const fetchAllLinks = async (page = 0) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { status, data } = await urlService.getMyUrls(page, 15)
    if (status === 200 && data.success) {
      links.value = data.data
      pageInfo.value = data.pageInfo
    } else {
      errorMessage.value = 'FETCH_ERROR // Core repository synchronization failure.'
    }
  } catch (error) {
    errorMessage.value = 'NETWORK_ERROR // Protocol connection timeout.'
  } finally {
    isLoading.value = false
  }
}

// Memicu jendela konfirmasi kustom terbuka
const confirmDelete = (shortCode) => {
  targetDeleteCode.value = shortCode
  isDeleteModalOpen.value = true
}

// Mengeksekusi penghapusan via API murni DELETE
const executeDeleteLink = async () => {
  if (!targetDeleteCode.value) return

  isDeleting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { status, data } = await urlService.deleteUrl(targetDeleteCode.value)

    if (status === 200 && data.success) {
      successMessage.value = `DELETION_SUCCESS // ${data.message}`
      isDeleteModalOpen.value = false
      targetDeleteCode.value = ''
      
      // Mengambil ulang data di halaman saat ini agar tabel otomatis ter-refresh
      await fetchAllLinks(pageInfo.value.currentPage)
      
      // Menghilangkan banner sukses otomatis setelah 4 detik
      setTimeout(() => { successMessage.value = '' }, 4000)
    } else {
      // Menangkap Kasus 2 (403 Forbidden) atau Kasus 3 (404 Not Found) langsung dari pesan Backend kamu
      errorMessage.value = data.message || 'ACCESS_DENIED // Purge request rejected.'
      isDeleteModalOpen.value = false
    }
  } catch (error) {
    errorMessage.value = 'PURGE_FAILURE // Failed to commit transaction to Database nodes.'
    isDeleteModalOpen.value = false
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchAllLinks()
})

const copyToClipboard = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => { copiedId.value = null }, 1500)
  })
}

const checkStatus = (link) => {
  return link.status || 'Active'
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'NEVER'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300 relative">
    
    <div 
      v-if="isDeleteModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div class="bg-surface-container-low border-2 border-outline-variant w-full max-w-md p-6 md:p-8 space-y-6 relative rounded-none shadow-2xl">
        <div class="flex justify-between items-center border-b border-outline-variant/40 pb-3 text-on-surface-variant font-code text-[11px]">
          <span>REPOSITORY_MANAGEMENT // PURGE_CORE</span>
          <span class="text-error animate-pulse">● SECURE_ZONE</span>
        </div>

        <div class="space-y-2">
          <h3 class="font-display text-lg font-bold text-on-background uppercase tracking-tight text-left">PURGE_SHORT_CODE?</h3>
          <p class="font-code text-xs text-on-surface-variant leading-relaxed text-left">
            Apakah Anda yakin ingin memusnahkan link pendek <span class="text-primary-fixed-dim font-bold">'{{ targetDeleteCode }}'</span>? Data pada layer Database & cache Redis akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div class="flex gap-4 font-code text-xs pt-2">
          <button 
            @click="isDeleteModalOpen = false" 
            :disabled="isDeleting"
            class="flex-1 border border-outline text-on-surface hover:bg-surface-variant py-3 transition-all rounded-none uppercase font-bold disabled:opacity-40"
          >
            ABORT_REQ
          </button>
          <button 
            @click="executeDeleteLink" 
            :disabled="isDeleting"
            class="flex-1 bg-red-600 text-white hover:bg-red-500 py-3 transition-all rounded-none uppercase font-bold active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            <span v-if="isDeleting" class="material-symbols-outlined text-sm animate-spin">sync</span>
            {{ isDeleting ? 'PURGING...' : 'COMMIT_DELETE' }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <span class="w-1 h-6 bg-primary-container"></span>
        <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Active_Repository_Central</h2>
      </div>
      <div class="flex items-center gap-4 text-on-surface-variant font-code text-xs">
        <span>TOTAL_ENTRIES: {{ String(totalEntries).padStart(2, '0') }}</span>
        <button class="material-symbols-outlined text-lg hover:text-primary-fixed-dim">filter_list</button>
      </div>
    </div>

    <div v-if="successMessage" class="p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase text-left animate-in fade-in duration-200">
      [SUCCESS]: {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase text-left animate-in fade-in duration-200">
      [SYSTEM_ERROR]: {{ errorMessage }}
    </div>

    <div class="overflow-x-auto border border-outline-variant bg-surface-container-lowest custom-scrollbar relative">
      <div v-if="isLoading" class="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10 flex items-center justify-center font-code text-xs text-primary-container">
        LOADING_ALL_REPOSITORY_DATA...
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
              <div class="flex flex-col max-w-xs md:max-w-md text-left">
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
                
                <button 
                  @click="confirmDelete(link.shortCode)"
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
          @click="fetchAllLinks(pageInfo.currentPage - 1)"
          :disabled="pageInfo.currentPage === 0 || isLoading"
          class="flex-1 sm:flex-initial px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all active:scale-95 disabled:opacity-30"
        >
          PREV
        </button>
        <button 
          @click="fetchAllLinks(pageInfo.currentPage + 1)"
          :disabled="(pageInfo.currentPage + 1) >= pageInfo.totalPages || isLoading"
          class="flex-1 sm:flex-initial px-4 py-2 border border-primary-container text-primary-container bg-primary-container/10 transition-all active:scale-95 disabled:opacity-30"
        >
          NEXT
        </button>
      </div>
    </div>

  </div>
</template>