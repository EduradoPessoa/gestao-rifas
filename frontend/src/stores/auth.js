import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/login', credentials)
        this.setAuthData(response.data)
        router.push('/perfil')
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/register', userData)
        this.setAuthData(response.data)
        router.push('/perfil')
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar conta'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      this.loading = true
      this.error = null
      try {
        await axios.post('/api/auth/forgot-password', { email })
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao recuperar senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(token, password) {
      this.loading = true
      this.error = null
      try {
        await axios.post('/api/auth/reset-password', { token, password })
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao redefinir senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const response = await axios.get('/api/auth/me')
        this.user = response.data
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout()
        }
      }
    },

    setAuthData({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.fetchUser()
      }
    }
  }
})
