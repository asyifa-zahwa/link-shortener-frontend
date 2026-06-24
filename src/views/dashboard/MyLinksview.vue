<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { urlService } from '../../services/url'

const links = ref([])
const pageInfo = ref({
  currentPage: 0,
  totalItems: 0,
  totalPages: 1
})

// State UI Tracking & Notifikasi
const isLoading = ref(false)
const isInitialLoading = ref(true) // LOCK SCREEN DI AWAL
const isDeleting = ref(false)
const isAnalyticsLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const copiedId = ref(null)

// State Kustom Modal Delete
const isDeleteModalOpen = ref(false)
const targetDeleteCode = ref('')

// State Contextual Analytics Drawer
const isAnalyticsOpen = ref(false)
const analyticsData = ref(null)

// State Pencarian Dengan Debounce
const searchQuery = ref('')
let debounceTimeout = null

const totalEntries = computed(() => pageInfo.value.totalItems)

const fetchAllLinks = async (page = 0) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { status, data } = await urlService.getMyUrls(page, 15, searchQuery.value)
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
    isInitialLoading.value = false // BUKA LOCK SCREEN
  }
}

watch(searchQuery, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchAllLinks(0)
  }, 500)
})

const openAnalyticsDrawer = async (shortCode) => {
  isAnalyticsOpen.value = true
  isAnalyticsLoading.value = true
  analyticsData.value = null
  errorMessage.value = ''

  try {
    const { status, data } = await urlService.getUrlAnalytics(shortCode)
    if (status === 200 && data.success) {
      analyticsData.value = data.data
    } else {
      errorMessage.value = `ANALYTICS_ERROR // Failed to gather metrics for '${shortCode}'`
      isAnalyticsOpen.value = false
    }
  } catch (error) {
    errorMessage.value = 'METRIC_CRASH // Telemetry stream configuration failed.'
    isAnalyticsOpen.value = false
  } finally {
    isAnalyticsLoading.value = false
  }
}

const calculatePercentage = (value, total) => {
  if (!total || total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

const confirmDelete = (shortCode) => {
  targetDeleteCode.value = shortCode
  isDeleteModalOpen.value = true
}

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
      await fetchAllLinks(pageInfo.value.currentPage)
      setTimeout(() => { successMessage.value = '' }, 4000)
    } else {
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
  <div class="relative min-h-[60vh]">
    
    <div 
      v-if="isInitialLoading" 
      class="absolute inset-0 bg-background z-50 flex flex-col items-center justify-center gap-4 font-code text-xs text-primary-container animate-in fade-in duration-200"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-base animate-spin">sync</span>
        <span class="tracking-widest uppercase">Querying_All_Active_Repositories...</span>
      </div>
      <div class="text-[10px] text-on-surface-variant/40">SECURE_ACCESS_LAYER // SYNCING_ALL_NODES</div>
    </div>

    <div v-else class="space-y-6 animate-in fade-in duration-300">
      
      <div v-if="isAnalyticsOpen" @click.self="isAnalyticsOpen = false" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] flex justify-end animate-in fade-in duration-200">
        <div class="bg-surface-container-low border-l-2 border-outline-variant w-full max-w-md h-full p-6 md:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 rounded-none overflow-y-auto custom-scrollbar">
          <div class="space-y-6">
            <div class="flex justify-between items-center border-b border-outline-variant pb-4">
              <div class="text-left">
                <span class="font-code text-[10px] text-primary-fixed-dim uppercase tracking-widest block">TELEMETRY_LOG // ACTIVE</span>
                <h3 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Link_Analytics</h3>
              </div>
              <button @click="isAnalyticsOpen = false" class="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed-dim transition-colors p-1">close</button>
            </div>

            <div v-if="isAnalyticsLoading" class="py-20 text-center font-code text-xs text-primary-container animate-pulse">QUERYING_METRICS_FROM_DATABASE_NODES...</div>

            <div v-else-if="analyticsData" class="space-y-8 text-left">
              <div class="bg-surface-container-lowest border border-outline-variant p-4 space-y-1">
                <div class="font-code text-[11px] text-on-surface-variant">TARGET_NODE_ID:</div>
                <div class="font-code text-sm font-bold text-primary-fixed-dim truncate">{{ analyticsData.shortCode }}</div>
                <div class="grid grid-cols-2 pt-3 border-t border-outline-variant/40 mt-2">
                  <div>
                    <span class="font-code text-[10px] text-on-surface-variant block">TOTAL_ENGAGEMENT</span>
                    <span class="font-code text-lg font-bold text-on-background">{{ analyticsData.totalClicks.toLocaleString() }} <span class="text-xs font-normal text-on-surface-variant">clicks</span></span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm text-primary-fixed-dim">devices</span>
                  <h4 class="font-code text-xs font-bold uppercase tracking-wider text-on-surface">CLICKS_BY_DEVICE</h4>
                </div>
                <div class="space-y-3 bg-surface-container-lowest border border-outline-variant p-4">
                  <div v-for="(clicks, device) in analyticsData.clicksByDevice" :key="device" class="space-y-1">
                    <div class="flex justify-between font-code text-xs">
                      <span class="uppercase text-on-surface-variant">{{ device }}</span>
                      <span class="font-bold text-on-background">{{ clicks }} ({{ calculatePercentage(clicks, analyticsData.totalClicks) }})</span>
                    </div>
                    <div class="w-full bg-surface-container-high h-2.5 rounded-none overflow-hidden border border-outline-variant/30">
                      <div class="bg-primary-container h-full transition-all duration-1000" :style="{ width: calculatePercentage(clicks, analyticsData.totalClicks) }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm text-primary-fixed-dim">language</span>
                  <h4 class="font-code text-xs font-bold uppercase tracking-wider text-on-surface">CLICKS_BY_BROWSER</h4>
                </div>
                <div class="space-y-3 bg-surface-container-lowest border border-outline-variant p-4">
                  <div v-for="(clicks, browser) in analyticsData.clicksByBrowser" :key="browser" class="space-y-1">
                    <div class="flex justify-between font-code text-xs">
                      <span class="uppercase text-on-surface-variant">{{ browser }}</span>
                      <span class="font-bold text-on-background">{{ clicks }} ({{ calculatePercentage(clicks, analyticsData.totalClicks) }})</span>
                    </div>
                    <div class="w-full bg-surface-container-high h-2.5 rounded-none overflow-hidden border border-outline-variant/30">
                      <div class="bg-primary-fixed-dim h-full transition-all duration-1000" :style="{ width: calculatePercentage(clicks, analyticsData.totalClicks) }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-outline-variant/40 pt-4 font-code text-[11px] text-on-surface-variant text-left flex justify-between">
            <span>SYSTEM_STATUS // ONLINE</span>
            <span>V1.0.0</span>
          </div>
        </div>
      </div>

      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-surface-container-low border-2 border-outline-variant w-full max-w-md p-6 md:p-8 space-y-6 relative rounded-none shadow-2xl">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-3 text-on-surface-variant font-code text-[11px]">
            <span>REPOSITORY_MANAGEMENT // PURGE_CORE</span>
            <span class="text-error animate-pulse">● SECURE_ZONE</span>
          </div>
          <div class="space-y-2 text-left">
            <h3 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">PURGE_SHORT_CODE?</h3>
            <p class="font-code text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin memusnahkan link pendek <span class="text-primary-fixed-dim font-bold">'{{ targetDeleteCode }}'</span>? Data pada layer Database & cache Redis akan dihapus secara permanen.
            </p>
          </div>
          <div class="flex gap-4 font-code text-xs pt-2">
            <button @click="isDeleteModalOpen = false" :disabled="isDeleting" class="flex-1 border border-outline text-on-surface hover:bg-surface-variant py-3 transition-all rounded-none uppercase font-bold disabled:opacity-40">ABORT_REQ</button>
            <button @click="executeDeleteLink" :disabled="isDeleting" class="flex-1 bg-red-600 text-white hover:bg-red-500 py-3 transition-all rounded-none uppercase font-bold active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="isDeleting" class="material-symbols-outlined text-sm animate-spin">sync</span>
              {{ isDeleting ? 'PURGING...' : 'COMMIT_DELETE' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="w-1 h-6 bg-primary-container"></span>
          <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Active_Repository_Central</h2>
        </div>
        
        <div class="w-full sm:w-72 relative">
          <span class="material-symbols-outlined text-on-surface-variant text-lg absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="FILTER_BY_SHORT_CODE..."
            class="w-full bg-surface-container-low border border-outline-variant focus:border-primary-container text-on-surface placeholder:text-on-surface-variant/50 font-code text-xs pl-10 pr-4 py-2.5 outline-none transition-all rounded-none"
          />
          <span v-if="searchQuery" class="font-code text-[9px] text-primary-fixed-dim absolute right-3 top-1/2 -translate-y-1/2 bg-primary-container/10 px-1 py-0.5 border border-primary-container/20">LIVE</span>
        </div>
      </div>

      <div class="flex justify-between items-center text-on-surface-variant font-code text-[11px] bg-surface-container-low border border-outline-variant/40 px-4 py-2">
        <span class="uppercase">Data_Stream: Stable</span>
        <span>TOTAL_ENTRIES: {{ String(totalEntries).padStart(2, '0') }}</span>
      </div>

      <div v-if="successMessage" class="p-3 bg-green-950/40 border border-primary-container text-primary-container font-code text-xs uppercase text-left">
        [SUCCESS]: {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="p-3 bg-red-950/40 border border-red-500 text-red-400 font-code text-xs uppercase text-left">
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
                  <span class="text-on-surface-variant font-code text-xs truncate" :title="link.longUrl">{{ link.longUrl }}</span>
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
                  <button @click="copyToClipboard(link.shortUrl, link.shortCode)" class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded" title="Copy Link">
                    <span class="material-symbols-outlined text-base">{{ copiedId === link.shortCode ? 'check_circle' : 'content_copy' }}</span>
                  </button>
                  
                  <button @click="openAnalyticsDrawer(link.shortCode)" class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded" title="View Analytics">
                    <span class="material-symbols-outlined text-base">monitoring</span>
                  </button>
                  
                  <button @click="confirmDelete(link.shortCode)" class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-error transition-all rounded" title="Delete Link">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="links.length === 0 && !isLoading">
              <td colspan="5" class="px-6 py-10 text-center font-code text-sm text-on-surface-variant">NO_REPOSITORIES_FOUND // DATA_LAYER_EMPTY</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 font-code text-xs">
        <span class="text-on-surface-variant">SHOWING_PAGE_{{ pageInfo.currentPage + 1 }}_OF_{{ pageInfo.totalPages }}</span>
        <div class="flex gap-2 w-full sm:w-auto">
          <button @click="fetchAllLinks(pageInfo.currentPage - 1)" :disabled="pageInfo.currentPage === 0 || isLoading" class="flex-1 sm:flex-initial px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all active:scale-95 disabled:opacity-30">PREV</button>
          <button @click="fetchAllLinks(pageInfo.currentPage + 1)" :disabled="(pageInfo.currentPage + 1) >= pageInfo.totalPages || isLoading" class="flex-1 sm:flex-initial px-4 py-2 border border-primary-container text-primary-container bg-primary-container/10 transition-all active:scale-95 disabled:opacity-30">NEXT</button>
        </div>
      </div>

    </div>
  </div>
</template>