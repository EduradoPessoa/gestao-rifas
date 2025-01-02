import { defineStore } from 'pinia';
import axios from 'axios';

export const useRaffleStore = defineStore('raffle', {
  state: () => ({
    raffles: [],
    loading: false,
    error: null
  }),

  getters: {
    activeRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'active'),
    draftRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'draft'),
    completedRaffles: (state) => state.raffles.filter(raffle => raffle.status === 'completed')
  },

  actions: {
    async fetchRaffles() {
      this.loading = true;
      try {
        const response = await axios.get('/api/raffles');
        this.raffles = response.data;
        this.error = null;
      } catch (err) {
        this.error = 'Erro ao carregar rifas';
        console.error('Error fetching raffles:', err);
      } finally {
        this.loading = false;
      }
    },

    async createRaffle(raffleData) {
      this.loading = true;
      try {
        const formData = new FormData();
        Object.keys(raffleData).forEach(key => {
          if (key === 'image' && raffleData[key]) {
            formData.append('image', raffleData[key]);
          } else {
            formData.append(key, raffleData[key]);
          }
        });

        const response = await axios.post('/api/raffles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.raffles.push(response.data);
        this.error = null;
        return response.data;
      } catch (err) {
        this.error = 'Erro ao criar rifa';
        console.error('Error creating raffle:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateRaffle(id, raffleData) {
      this.loading = true;
      try {
        const formData = new FormData();
        Object.keys(raffleData).forEach(key => {
          if (key === 'image' && raffleData[key]) {
            formData.append('image', raffleData[key]);
          } else {
            formData.append(key, raffleData[key]);
          }
        });

        const response = await axios.put(`/api/raffles/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const index = this.raffles.findIndex(r => r.id === id);
        if (index !== -1) {
          this.raffles[index] = response.data;
        }
        this.error = null;
        return response.data;
      } catch (err) {
        this.error = 'Erro ao atualizar rifa';
        console.error('Error updating raffle:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async activateRaffle(id) {
      this.loading = true;
      try {
        const response = await axios.patch(`/api/raffles/${id}/activate`);
        const index = this.raffles.findIndex(r => r.id === id);
        if (index !== -1) {
          this.raffles[index] = response.data;
        }
        this.error = null;
        return response.data;
      } catch (err) {
        this.error = 'Erro ao ativar rifa';
        console.error('Error activating raffle:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async performDraw(id) {
      this.loading = true;
      try {
        const response = await axios.post(`/api/raffles/${id}/draw`);
        const index = this.raffles.findIndex(r => r.id === id);
        if (index !== -1) {
          this.raffles[index] = response.data;
        }
        this.error = null;
        return response.data;
      } catch (err) {
        this.error = 'Erro ao realizar sorteio';
        console.error('Error performing draw:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
