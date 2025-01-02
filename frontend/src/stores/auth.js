import { defineStore } from 'pinia'
import axios from '../plugins/axios'
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
        const response = await axios.post('/auth/login', credentials)
        this.setAuthData(response.data)
        router.push('/')
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data)
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
        const response = await axios.post('/auth/register', userData)
        this.setAuthData(response.data)
        router.push('/')
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data)
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
        await axios.post('/auth/forgot-password', { email })
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data)
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
        await axios.post('/auth/reset-password', { token, password })
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data)
        this.error = error.response?.data?.message || 'Erro ao redefinir senha'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/auth/me')
        this.user = response.data
      } catch (error) {
        this.logout()
        throw error
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
      router.push('/auth')
    },

    async initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          await this.fetchUser()
        } catch (error) {
          this.logout()
        }
      }
    }
  }
})
