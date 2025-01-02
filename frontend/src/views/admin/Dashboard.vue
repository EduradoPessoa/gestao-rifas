<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Painel Administrativo</h1>
      <div class="user-info">
        <span>{{ authStore.user?.name }}</span>
        <button @click="authStore.logout" class="btn btn--secondary">
          Sair
        </button>
      </div>
    </header>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>Total de Rifas</h3>
        <p class="stat-value">{{ stats.totalRaffles }}</p>
      </div>
      <div class="stat-card">
        <h3>Rifas Ativas</h3>
        <p class="stat-value">{{ stats.activeRaffles }}</p>
      </div>
      <div class="stat-card">
        <h3>Vendas Hoje</h3>
        <p class="stat-value">R$ {{ stats.todaySales.toFixed(2) }}</p>
      </div>
      <div class="stat-card">
        <h3>Total de Usuários</h3>
        <p class="stat-value">{{ stats.totalUsers }}</p>
      </div>
    </div>

    <div class="dashboard-content">
      <nav class="dashboard-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

const stats = ref({
  totalRaffles: 0,
  activeRaffles: 0,
  todaySales: 0,
  totalUsers: 0
})

const menuItems = [
  { label: 'Rifas', path: '/admin/rifas' },
  { label: 'Usuários', path: '/admin/usuarios' },
  { label: 'Vendas', path: '/admin/vendas' },
  { label: 'Configurações', path: '/admin/configuracoes' }
]

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--color-background-light);
}

.dashboard-header {
  background: white;
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.dashboard-header h1 {
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-info span {
  font-family: var(--font-body);
  color: var(--color-neutral);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.stat-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.stat-card h3 {
  font-family: var(--font-body);
  color: var(--color-neutral);
  margin: 0 0 var(--spacing-sm);
  font-size: 1rem;
}

.stat-value {
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-size: 2rem;
  margin: 0;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.dashboard-nav {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-item {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-neutral);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
}

.nav-item:hover {
  background: var(--color-background-light);
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .dashboard-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: var(--spacing-sm);
  }

  .nav-item {
    white-space: nowrap;
  }
}
</style>
