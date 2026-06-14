import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Import Pinia store untuk auth

const routes = [
  {
    path: '/',
    component: () => import('../layouts/LandingLayout.vue'),
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('../views/Landingview.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/LandingLayout.vue'),
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/auth/Loginview.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/auth/Registerview.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-main',
        component: () => import('../views/dashboard/Dashboardview.vue')
      },
      {
        path: 'my-links',
        name: 'my-links',
        component: () => import('../views/dashboard/MyLinksview.vue')
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('../views/dashboard/Analyticsview.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // PANGGIL STORE DI DALAM SINI, JANGAN DI LUAR!
  const authStore = useAuthStore()

  // Jika halaman yang dituju butuh auth, tapi user BELUM login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } 
  // Jika user SUDAH login tapi iseng mau buka halaman auth lagi
  else if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next('/dashboard')
  } 
  else {
    next() // Izinkan lewat
  }
})

export default router