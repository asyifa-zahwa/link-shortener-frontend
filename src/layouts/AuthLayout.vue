<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col justify-center items-center px-4 md:px-0 antialiased font-body relative overflow-hidden">
    
    <div class="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

    <div class="flex items-center gap-2 mb-8 relative z-10">
      <span class="material-symbols-outlined text-primary-fixed-dim text-3xl">link</span>
      <span class="font-display text-2xl font-bold tracking-tighter text-primary-fixed-dim">LNK_SHRT</span>
    </div>

    <div class="w-full max-w-md bg-surface-container border border-outline-variant p-6 md:p-8 relative z-10 transition-all duration-300 shadow-xl">
      <router-view />
    </div>

    <div class="mt-8 font-code text-xs text-on-tertiary-container relative z-10">
      SECURE_ACCESS_LAYER // v2.4.0
    </div>
  </div>
</template>