<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container font-body">
    
    <header class="bg-background w-full top-0 border-b border-outline-variant fixed z-50">
      <div class="flex justify-between items-center px-6 md:px-12 py-4 max-w-[1200px] mx-auto">
        
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-fixed-dim">link</span>
          <span class="font-display text-xl md:text-2xl font-bold tracking-tighter text-primary-fixed-dim">LNK_SHRT</span>
        </div>
        
        <nav class="hidden md:flex gap-6 items-center">
          <router-link 
            to="/" 
            exact-active-class="text-primary-fixed-dim bg-surface-container-low border border-outline-variant"
            class="font-code text-xs text-on-surface-variant hover:text-primary-fixed-dim transition-all px-3 py-1.5 border border-transparent"
          >
            SHORTEN
          </router-link>
          
          <router-link 
            to="/auth/login" 
            active-class="text-primary-fixed-dim bg-surface-container-low border border-outline-variant"
            class="font-code text-xs text-on-surface-variant hover:text-primary-fixed-dim transition-all px-3 py-1.5 border border-transparent"
          >
            LOGIN
          </router-link>

          <router-link 
            to="/auth/register" 
            active-class="text-primary-fixed-dim bg-surface-container-low border border-outline-variant"
            class="font-code text-xs text-on-surface-variant hover:text-primary-fixed-dim transition-all px-3 py-1.5 border border-transparent"
          >
            REGISTER
          </router-link>
        </nav>

        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-variant transition-colors rounded"
        >
          {{ isMobileMenuOpen ? 'close' : 'menu' }}
        </button>
      </div>

      <div v-if="isMobileMenuOpen" class="md:hidden bg-background border-b border-outline-variant px-6 py-4 flex flex-col gap-2 text-left">
        <router-link 
          to="/" 
          @click="isMobileMenuOpen = false" 
          exact-active-class="text-primary-fixed-dim bg-surface-container-low pl-3 border-l-2 border-primary-container"
          class="font-code text-sm text-on-surface-variant py-2 transition-all block"
        >
          SHORTEN
        </router-link>
        
        <router-link 
          to="/auth/login" 
          @click="isMobileMenuOpen = false" 
          active-class="text-primary-fixed-dim bg-surface-container-low pl-3 border-l-2 border-primary-container"
          class="font-code text-sm text-on-surface-variant py-2 transition-all block"
        >
          LOGIN
        </router-link>

        <router-link 
          to="/auth/register" 
          @click="isMobileMenuOpen = false" 
          active-class="text-primary-fixed-dim bg-surface-container-low pl-3 border-l-2 border-primary-container"
          class="font-code text-sm text-on-surface-variant py-2 transition-all block"
        >
          REGISTER
        </router-link>
      </div>
    </header>

    <main class="pt-24 pb-16">
      <router-view />
    </main>

    <footer class="bg-background border-t border-outline-variant">
      <div class="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-6 max-w-[1200px] mx-auto gap-4">
        <div class="flex items-center gap-4">
          <span class="font-display font-bold text-primary-fixed-dim">LNK_SHRT</span>
          <span class="font-code text-xs text-on-surface-variant">© 2026 LNK_SHRT. PURE_UTILITY.</span>
        </div>
        <div class="flex gap-6 font-code text-xs text-on-surface-variant">
          <a href="#" class="hover:text-primary-fixed-dim transition-colors">API</a>
          <a href="#" class="hover:text-primary-fixed-dim transition-colors">PRIVACY</a>
          <a href="#" class="hover:text-primary-fixed-dim transition-colors">TERMS</a>
        </div>
      </div>
    </footer>

  </div>
</template>