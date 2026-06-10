import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('../layouts/AuthLayout.vue'),
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

export default router