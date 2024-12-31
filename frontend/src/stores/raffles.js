import { defineStore } from 'pinia'
import axios from 'axios'

export const useRaffleStore = defineStore('raffles', {
  state: () => ({
    raffles: [],
    loading: false,
    error: null,
    selectedRaffle: null,
    selectedQuotes: [],
    cart: []
  }),

  getters: {
    activeRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'active'),
    upcomingRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'soon'),
    completedRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'completed'),
    
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + (item.raffle.quote_price * item.quotes.length)
      }, 0)
    }
  },

  actions: {
    async fetchRaffles() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/raffles')
        this.raffles = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar rifas'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRaffleDetails(raffleId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/api/raffles/${raffleId}`)
        this.selectedRaffle = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar detalhes da rifa'
        throw error
      } finally {
        this.loading = false
      }
    },

    selectQuote(raffleId, quoteNumber) {
      const index = this.selectedQuotes.findIndex(q => q === quoteNumber)
      if (index === -1) {
        this.selectedQuotes.push(quoteNumber)
      } else {
        this.selectedQuotes.splice(index, 1)
      }
    },

    addToCart(raffle, quotes) {
      this.cart.push({
        raffle,
        quotes: [...quotes]
      })
      this.selectedQuotes = []
      this.selectedRaffle = null
    },

    removeFromCart(index) {
      this.cart.splice(index, 1)
    },

    clearCart() {
      this.cart = []
    },

    async checkout(paymentData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/checkout', {
          items: this.cart,
          payment: paymentData
        })
        this.clearCart()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao processar pagamento'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
