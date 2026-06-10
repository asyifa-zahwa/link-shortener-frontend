<script setup>
import { ref, computed } from 'vue'

// State untuk menampung Form Input Link Baru
const originalUrl = ref('')
const customAlias = ref('')
const expiryDate = ref('')

// State untuk efek menyalin (copy feedback per item ID)
const copiedId = ref(null)

// Mock Data Awal untuk Repository Link (Simulasi Data dari Database)
const links = ref([
  {
    id: 1,
    identity: 'lnk.shrt/summer-promo',
    longUrl: 'https://marketing.global.corp/campaigns/2024/summer-deals-v2',
    clicks: 1402,
    status: 'Active',
    expiry: '2024-12-31'
  },
  {
    id: 2,
    identity: 'lnk.shrt/dev-docs',
    longUrl: 'https://github.com/lnkshrt/api-reference/v4/endpoints',
    clicks: 842,
    status: 'Active',
    expiry: '2025-06-15'
  },
  {
    id: 3,
    identity: 'lnk.shrt/old-event',
    longUrl: 'https://eventbrite.com/legacy/conference-2023',
    clicks: 32,
    status: 'Expired',
    expiry: '2023-12-01'
  }
])

// Menghitung total entri secara dinamis
const totalEntries = computed(() => links.value.length)

// Fungsi untuk membuat Short Link baru secara lokal (Simulasi Reaktivitas)
const generateShortLink = () => {
  if (!originalUrl.value) return

  const alias = customAlias.value || Math.random().toString(36).substring(2, 7)
  
  const newLink = {
    id: Date.now(),
    identity: `lnk.shrt/${alias}`,
    longUrl: originalUrl.value,
    clicks: 0,
    status: 'Active',
    expiry: expiryDate.value || 'NEVER'
  }

  // Masukkan data baru ke urutan paling atas tabel
  links.value.unshift(newLink)

  // Reset form input kembali bersih
  originalUrl.value = ''
  customAlias.value = ''
  expiryDate.value = ''
}

// Fungsi salin teks ke clipboard dengan Micro-interaction feedback
const copyToClipboard = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 1500)
  })
}

// Fungsi hapus link dari tabel
const deleteLink = (id) => {
  if (confirm('Apakah anda yakin ingin menghapus data link ini dari infrastruktur?')) {
    links.value = links.value.filter(link => link.id !== id)
  }
}
</script>

<template>
  <div class="space-y-10">
    
    <!-- SECTION 1: GENERATE_NEW_LINK -->
    <section>
      <div class="flex items-center gap-3 mb-4">
        <span class="w-1 h-6 bg-primary-container"></span>
        <h2 class="font-display text-lg font-bold text-on-background uppercase tracking-tight">Generate_New_Link</h2>
      </div>
      
      <div class="bg-surface-container-low border border-outline-variant p-6 md:p-8">
        <form @submit.prevent="generateShortLink" class="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div class="md:col-span-5 flex flex-col gap-2">
            <label class="font-code text-xs text-on-surface-variant uppercase">ORIGINAL_URL</label>
            <input 
              v-model="originalUrl"
              type="url" 
              placeholder="https://very-long-destination-url.com/path" 
              required
              class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none"
            />
          </div>

          <div class="md:col-span-3 flex flex-col gap-2">
            <label class="font-code text-xs text-on-surface-variant uppercase">CUSTOM_ALIAS</label>
            <input 
              v-model="customAlias"
              type="text" 
              placeholder="my-custom-path" 
              class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none"
            />
          </div>

          <div class="md:col-span-2 flex flex-col gap-2">
            <label class="font-code text-xs text-on-surface-variant uppercase">EXPIRY_DATE</label>
            <input 
              v-model="expiryDate"
              type="date" 
              class="bg-surface-container-lowest border border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-code text-sm px-4 py-3 outline-none transition-all rounded-none text-white invert-date-icon"
            />
          </div>

          <div class="md:col-span-2 flex items-end">
            <button 
              type="submit"
              class="w-full bg-primary-container text-on-primary-container font-display font-bold py-3.5 hover:brightness-110 active:scale-95 transition-all uppercase text-sm tracking-wider"
            >
              SHORTEN
            </button>
          </div>

        </form>
      </div>
    </section>

    <!-- SECTION 2: ACTIVE_REPOSITORY -->
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

      <!-- High Density Responsive Table Wrapper -->
      <div class="overflow-x-auto border border-outline-variant bg-surface-container-lowest custom-scrollbar">
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
              :key="link.id" 
              class="hover:bg-surface-container/40 transition-colors group"
              :class="link.status === 'Expired' ? 'opacity-50' : ''"
            >
              <!-- Link Identity -->
              <td class="px-6 py-4">
                <div class="flex flex-col max-w-xs md:max-w-md">
                  <span class="font-code text-sm font-bold text-primary-fixed-dim mb-0.5">{{ link.identity }}</span>
                  <span class="text-on-surface-variant font-code text-xs truncate" :title="link.longUrl">
                    {{ link.longUrl }}
                  </span>
                </div>
              </td>
              
              <!-- Engagement/Clicks -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2 font-code text-sm font-bold text-on-surface">
                  <span class="material-symbols-outlined text-sm text-primary-fixed-dim">ads_click</span>
                  {{ link.clicks.toLocaleString() }}
                </div>
              </td>
              
              <!-- Status Tag -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-0.5 border font-code text-[10px] uppercase font-bold tracking-wider"
                  :class="link.status === 'Active' ? 'border-primary-fixed-dim text-primary-fixed-dim' : 'border-on-secondary-container text-on-secondary-container'"
                >
                  {{ link.status }}
                </span>
              </td>
              
              <!-- Expiry Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-code text-xs text-on-surface-variant">{{ link.expiry }}</span>
              </td>
              
              <!-- Utility Buttons (Actions) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-end gap-1">
                  <!-- Copy Button -->
                  <button 
                    @click="copyToClipboard(link.identity, link.id)"
                    class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded"
                    title="Copy Link"
                  >
                    <span class="material-symbols-outlined text-base">
                      {{ copiedId === link.id ? 'check_circle' : 'content_copy' }}
                    </span>
                  </button>
                  
                  <!-- Edit Button -->
                  <button class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary-fixed-dim transition-all rounded" title="Edit Link">
                    <span class="material-symbols-outlined text-base">edit</span>
                  </button>
                  
                  <!-- Delete Button -->
                  <button 
                    @click="deleteLink(link.id)"
                    class="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-error transition-all rounded"
                    title="Delete Link"
                  >
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- State data kosong -->
            <tr v-if="links.length === 0">
              <td colspan="5" class="px-6 py-10 text-center font-code text-sm text-on-surface-variant">
                NO_REPOSITORIES_FOUND // DATA_LAYER_EMPTY
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Pagination Concept Layout -->
      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 font-code text-xs">
        <span class="text-on-surface-variant">
          SHOWING_ITEMS_01-{{ links.length }}_OF_0{{ totalEntries }}
        </span>
        <div class="flex gap-2 w-full sm:w-auto">
          <button class="flex-1 sm:flex-initial px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-all active:scale-95">
            PREV
          </button>
          <button class="flex-1 sm:flex-initial px-4 py-2 border border-primary-container text-primary-container bg-primary-container/10 transition-all active:scale-95">
            NEXT
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Memaksa ikon kalender di input[type="date"] menjadi warna putih terang */
.invert-date-icon::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>