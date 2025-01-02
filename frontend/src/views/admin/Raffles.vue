<template>
  <AdminLayout>
    <template #header>Gerenciar Rifas</template>
    
    <template #actions>
      <button @click="openCreateModal" class="btn btn-primary flex items-center gap-2">
        <i class="fas fa-plus"></i>
        <span>Nova Rifa</span>
      </button>
    </template>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Total de Rifas</h3>
        <p class="text-3xl font-semibold text-primary-600">{{ raffles.length }}</p>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Rifas Ativas</h3>
        <p class="text-3xl font-semibold text-green-600">{{ activeRaffles.length }}</p>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Total Arrecadado</h3>
        <p class="text-3xl font-semibold text-blue-600">R$ {{ totalRevenue.toFixed(2) }}</p>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Números Vendidos</h3>
        <p class="text-3xl font-semibold text-purple-600">{{ totalSoldNumbers }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <select v-model="entriesPerPage" class="input max-w-[100px]">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span class="text-gray-500">entradas por página</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            v-for="filter in ['Todas', 'Ativas', 'Rascunho', 'Concluídas']" 
            :key="filter"
            @click="currentFilter = filter.toLowerCase()"
            :class="[
              'btn',
              currentFilter === filter.toLowerCase() ? 'btn-primary' : 'btn-outline'
            ]"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Produto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Números
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data do Sorteio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="raffle in filteredRaffles" :key="raffle.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="raffle.image_url" class="h-10 w-10 rounded-lg object-cover mr-3" />
                  <div>
                    <div class="font-medium text-gray-900">{{ raffle.product_name }}</div>
                    <div class="text-sm text-gray-500">{{ raffle.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">R$ {{ raffle.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ raffle.sold_numbers }}/{{ raffle.total_numbers }}</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    class="bg-primary-600 h-2 rounded-full" 
                    :style="{ width: (raffle.sold_numbers / raffle.total_numbers * 100) + '%' }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(raffle.draw_date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': raffle.status === 'active',
                    'bg-gray-100 text-gray-800': raffle.status === 'draft',
                    'bg-blue-100 text-blue-800': raffle.status === 'completed'
                  }"
                >
                  {{ raffle.status.charAt(0).toUpperCase() + raffle.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editRaffle(raffle)" class="text-primary-600 hover:text-primary-900">
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="raffle.status === 'draft'"
                  @click="activateRaffle(raffle.id)" 
                  class="text-green-600 hover:text-green-900"
                >
                  <i class="fas fa-play"></i>
                </button>
                <button 
                  v-if="raffle.status === 'active'"
                  @click="drawRaffle(raffle.id)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  <i class="fas fa-trophy"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredRaffles.length) }} 
          de {{ filteredRaffles.length }} resultados
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="btn btn-outline"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'btn',
              currentPage === page ? 'btn-primary' : 'btn-outline'
            ]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="btn btn-outline"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <RaffleModal 
      v-if="showModal"
      :raffle="selectedRaffle"
      @close="closeModal"
      @save="saveRaffle"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRaffleStore } from '../../stores/raffle'
import AdminLayout from '../../layouts/AdminLayout.vue'
import RaffleModal from '../../components/RaffleModal.vue'

const raffleStore = useRaffleStore()
const showModal = ref(false)
const selectedRaffle = ref(null)
const currentFilter = ref('todas')
const currentPage = ref(1)
const entriesPerPage = ref(10)
const searchQuery = ref('')

// Computed Properties
const raffles = computed(() => raffleStore.raffles)
const activeRaffles = computed(() => raffles.value.filter(r => r.status === 'active'))
const totalRevenue = computed(() => {
  return raffles.value.reduce((total, raffle) => {
    return total + (raffle.sold_numbers * raffle.price)
  }, 0)
})
const totalSoldNumbers = computed(() => {
  return raffles.value.reduce((total, raffle) => total + raffle.sold_numbers, 0)
})

const filteredRaffles = computed(() => {
  let filtered = [...raffles.value]
  
  // Apply status filter
  if (currentFilter.value !== 'todas') {
    filtered = filtered.filter(r => r.status === currentFilter.value)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.product_name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Pagination
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value)
const endIndex = computed(() => startIndex.value + entriesPerPage.value)
const totalPages = computed(() => Math.ceil(filteredRaffles.value.length / entriesPerPage.value))

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openCreateModal = () => {
  selectedRaffle.value = null
  showModal.value = true
}

const editRaffle = (raffle) => {
  selectedRaffle.value = { ...raffle }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedRaffle.value = null
}

const saveRaffle = async (raffleData) => {
  if (selectedRaffle.value) {
    await raffleStore.updateRaffle(selectedRaffle.value.id, raffleData)
  } else {
    await raffleStore.createRaffle(raffleData)
  }
  closeModal()
}

const activateRaffle = async (raffleId) => {
  await raffleStore.activateRaffle(raffleId)
}

const drawRaffle = async (raffleId) => {
  await raffleStore.drawRaffle(raffleId)
}
</script>
