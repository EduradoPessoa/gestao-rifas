import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/auth')
    } else {
      next()
    }
  }
  // Rota é apenas para visitantes (como login)
  else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }
  // Rota pública
  else {
    next()
  }
})

export default router
