<template>
  <div class="rifas">
    <div class="rifas__header">
      <h1>Rifas Disponíveis</h1>
      <div class="rifas__filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar rifas..."
            @input="filterRaffles"
          >
        </div>
        <div class="filter-box">
          <select v-model="statusFilter" @change="filterRaffles">
            <option value="">Todos os Status</option>
            <option value="active">Em Andamento</option>
            <option value="soon">Em Breve</option>
            <option value="completed">Finalizadas</option>
          </select>
        </div>
        <div class="sort-box">
          <select v-model="sortBy" @change="filterRaffles">
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="ending-soon">Terminando em Breve</option>
          </select>
        </div>
      </div>
    </div>

    <div class="rifas__content">
      <div v-if="loading" class="loading">
        <span class="loader"></span>
      </div>

      <div v-else-if="filteredRaffles.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>Nenhuma rifa encontrada com os filtros selecionados</p>
      </div>

      <div v-else class="raffle-grid">
        <RaffleCard
          v-for="raffle in filteredRaffles"
          :key="raffle.id"
          :raffle="raffle"
          @select-quote="openRaffleDetails(raffle)"
        />
      </div>
    </div>

    <!-- Modal de Detalhes da Rifa -->
    <div v-if="selectedRaffle" class="modal" @click="closeModal">
      <div class="modal__content" @click.stop>
        <button class="modal__close" @click="closeModal">&times;</button>
        
        <div class="raffle-details">
          <img :src="selectedRaffle.image_url" :alt="selectedRaffle.name">
          <div class="raffle-details__info">
            <h2>{{ selectedRaffle.name }}</h2>
            <p class="description">{{ selectedRaffle.description }}</p>
            
            <div class="stats">
              <div class="stat">
                <span class="label">Valor por Número</span>
                <span class="value">R$ {{ formatPrice(selectedRaffle.quote_price) }}</span>
              </div>
              <div class="stat">
                <span class="label">Números Disponíveis</span>
                <span class="value">{{ selectedRaffle.total_quotes - selectedRaffle.sold_quotes }}</span>
              </div>
              <div class="stat">
                <span class="label">Data do Sorteio</span>
                <span class="value">{{ formatDate(selectedRaffle.draw_date) }}</span>
              </div>
            </div>

            <div class="quote-selection">
              <h3>Escolha seus Números</h3>
              <div class="quote-grid">
                <button
                  v-for="n in selectedRaffle.total_quotes"
                  :key="n"
                  :class="['quote-number', {
                    'quote-number--taken': isQuoteTaken(n),
                    'quote-number--selected': isQuoteSelected(n)
                  }]"
                  :disabled="isQuoteTaken(n)"
                  @click="toggleQuote(n)"
                >
                  {{ n }}
                </button>
              </div>
            </div>

            <div class="actions">
              <div class="summary">
                <span>{{ selectedQuotes.length }} números selecionados</span>
                <span class="total">Total: R$ {{ formatPrice(selectedRaffle.quote_price * selectedQuotes.length) }}</span>
              </div>
              <button 
                class="btn btn--primary"
                :disabled="selectedQuotes.length === 0"
                @click="proceedToCheckout"
              >
                Comprar Números
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RaffleCard from '../components/RaffleCard.vue'

const router = useRouter()
const loading = ref(true)
const raffles = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')
const selectedRaffle = ref(null)
const selectedQuotes = ref([])

// Simulando carregamento de dados
onMounted(async () => {
  // Aqui você faria uma chamada API real
  setTimeout(() => {
    raffles.value = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'iPhone 15 Pro Max 256GB, Cor: Titânio Natural',
        image_url: '/images/iphone.jpg',
        quote_price: 10.00,
        total_quotes: 1000,
        sold_quotes: 150,
        status: 'active',
        draw_date: '2024-01-31T20:00:00',
        taken_quotes: [1, 2, 3, 15, 22, 45, 67, 89, 100]
      },
      // Adicione mais rifas aqui
    ]
    loading.value = false
  }, 1000)
})

const filteredRaffles = computed(() => {
  let filtered = [...raffles.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(raffle => 
      raffle.name.toLowerCase().includes(query) ||
      raffle.description.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(raffle => raffle.status === statusFilter.value)
  }

  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.quote_price - b.quote_price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.quote_price - a.quote_price)
      break
    case 'ending-soon':
      filtered.sort((a, b) => new Date(a.draw_date) - new Date(b.draw_date))
      break
    default:
      filtered.sort((a, b) => b.id - a.id)
  }

  return filtered
})

const openRaffleDetails = (raffle) => {
  selectedRaffle.value = raffle
  selectedQuotes.value = []
}

const closeModal = () => {
  selectedRaffle.value = null
  selectedQuotes.value = []
}

const isQuoteTaken = (number) => {
  return selectedRaffle.value?.taken_quotes.includes(number)
}

const isQuoteSelected = (number) => {
  return selectedQuotes.value.includes(number)
}

const toggleQuote = (number) => {
  const index = selectedQuotes.value.indexOf(number)
  if (index === -1) {
    selectedQuotes.value.push(number)
  } else {
    selectedQuotes.value.splice(index, 1)
  }
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const proceedToCheckout = () => {
  // Aqui você implementaria a lógica de checkout
  console.log('Números selecionados:', selectedQuotes.value)
  router.push({
    name: 'Checkout',
    params: { 
      raffleId: selectedRaffle.value.id
    },
    query: {
      quotes: selectedQuotes.value.join(',')
    }
  })
}
</script>

<style scoped>
.rifas {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.rifas__header {
  margin-bottom: var(--spacing-xl);
}

.rifas__header h1 {
  font-family: var(--font-heading);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-lg);
}

.rifas__filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--spacing-md);
  align-items: center;
}

.search-box input,
.filter-box select,
.sort-box select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-body);
}

.raffle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.loading,
.no-results {
  text-align: center;
  padding: var(--spacing-xl);
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--color-primary);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal__content {
  background: white;
  border-radius: var(--border-radius-lg);
  max-width: 90%;
  width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal__close {
  position: absolute;
  right: var(--spacing-md);
  top: var(--spacing-md);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-neutral);
}

.raffle-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.raffle-details img {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-md);
}

.raffle-details__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.stat {
  text-align: center;
  padding: var(--spacing-md);
  background: #f5f5f5;
  border-radius: var(--border-radius-sm);
}

.stat .label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: var(--spacing-xs);
}

.stat .value {
  font-weight: bold;
  color: var(--color-primary);
}

.quote-selection {
  margin-top: var(--spacing-lg);
}

.quote-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
}

.quote-number {
  aspect-ratio: 1;
  border: 1px solid #ddd;
  background: white;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.quote-number:hover:not(:disabled) {
  background: var(--color-secondary);
  color: white;
}

.quote-number--taken {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.quote-number--selected {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.actions {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary {
  display: flex;
  flex-direction: column;
}

.summary .total {
  font-weight: bold;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .rifas__filters {
    grid-template-columns: 1fr;
  }

  .raffle-details {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
