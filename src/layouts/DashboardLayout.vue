<template>
  <div class="bg-surface text-on-surface min-h-screen antialiased font-body flex flex-col md:flex-row">
    
    <aside class="hidden md:flex flex-col w-64 bg-background border-r border-outline-variant min-h-screen fixed left-0 top-0 z-30 p-6 justify-between">
      <div class="space-y-8">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-fixed-dim">link</span>
          <span class="font-display text-xl font-bold tracking-tighter text-primary-fixed-dim">LNK_SHRT</span>
        </div>

        <!-- Menu Navigasi Samping -->
         <nav class="flex flex-col gap-2">
            <router-link to="/dashboard" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
                <span class="material-symbols-outlined text-lg">dashboard</span> DASHBOARD
            </router-link>
            <router-link to="/dashboard/my-links" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
                <span class="material-symbols-outlined text-lg">list</span> MY LINKS
            </router-link>
            <router-link to="/dashboard/analytics" class="flex items-center gap-3 font-code text-sm px-4 py-3 border border-transparent hover:border-outline-variant transition-all text-on-surface-variant" active-class="border-primary-container text-primary-fixed-dim bg-surface-container-low">
                <span class="material-symbols-outlined text-lg">analytics</span> ANALYTICS
            </router-link>
            </nav>
      </div>

      <router-link to="/" class="flex items-center gap-3 font-code text-sm px-4 py-3 text-error hover:bg-surface-variant transition-colors">
        <span class="material-symbols-outlined text-lg">logout</span> LOGOUT
      </router-link>
    </aside>

    <div class="flex-grow md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0">
      
      <header class="bg-background/80 backdrop-blur-md md:bg-background border-b border-outline-variant px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div class="flex items-center gap-2 md:hidden">
          <span class="font-display font-bold text-primary-fixed-dim tracking-tighter">LNK_SHRT</span>
        </div>
        <div class="font-code text-xs text-on-surface-variant hidden md:block">
          SYSTEM_STATUS: <span class="text-primary-container">ONLINE</span>
        </div>
        <div class="flex items-center gap-2 font-code text-xs">
          <span class="material-symbols-outlined text-sm">account_circle</span> USER_01
        </div>
      </header>

      <main class="p-4 md:p-8 flex-grow max-w-[1200px] w-full mx-auto">
        <router-view />
      </main>
    </div>

    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 bg-background border-t border-outline-variant md:hidden shadow-lg">
      <router-link to="/dashboard" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">dashboard</span>
      </router-link>
      <router-link to="/dashboard/my-links" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">list</span>
      </router-link>
      <router-link to="/dashboard/analytics" class="text-on-surface-variant flex flex-col items-center justify-center transition-all" active-class="text-primary-fixed-dim scale-110">
        <span class="material-symbols-outlined">analytics</span>
      </router-link>
      <router-link to="/" class="text-error opacity-70 flex flex-col items-center justify-center">
        <span class="material-symbols-outlined">logout</span>
      </router-link>
    </nav>

  </div>
</template>