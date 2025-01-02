import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Views
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Rifas from '../views/Rifas.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminRaffles from '../views/admin/Raffles.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
    meta: { guest: true }
  },
  {
    path: '/rifas',
    name: 'rifas',
    component: Rifas,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-raffles' }
      },
      {
        path: 'rifas',
        name: 'admin-raffles',
        component: AdminRaffles
      }
      // Outras rotas admin serão adicionadas aqui
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  // Redireciona para login se não estiver autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth' })
    return
  }

  // Redireciona para home se tentar acessar rotas de guest estando autenticado
  if (isGuestRoute && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Redireciona para home se não for admin tentando acessar área admin
  if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
