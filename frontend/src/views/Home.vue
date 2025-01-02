<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-container">
        <img src="@/assets/logo.svg" alt="Rifas Online" class="logo" />
        <span class="logo-text">Rifas Online</span>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/" class="nav-item active">
          <i class="fas fa-home"></i>
          <span>Início</span>
        </router-link>
        <router-link to="/rifas" class="nav-item">
          <i class="fas fa-ticket-alt"></i>
          <span>Minhas Rifas</span>
        </router-link>
        <router-link to="/vendas" class="nav-item">
          <i class="fas fa-shopping-cart"></i>
          <span>Vendas</span>
        </router-link>
        <router-link to="/sorteios" class="nav-item">
          <i class="fas fa-trophy"></i>
          <span>Sorteios</span>
        </router-link>
        
        <!-- Menu Admin -->
        <template v-if="authStore.isAdmin">
          <div class="menu-divider"></div>
          <router-link to="/admin/rifas" class="nav-item">
            <i class="fas fa-cog"></i>
            <span>Gerenciar Rifas</span>
          </router-link>
          <router-link to="/admin/produtos" class="nav-item">
            <i class="fas fa-box"></i>
            <span>Produtos</span>
          </router-link>
          <router-link to="/admin/configuracoes" class="nav-item">
            <i class="fas fa-sliders-h"></i>
            <span>Configurações</span>
          </router-link>
        </template>
      </nav>

      <div class="user-config">
        <div class="user-info">
          <div class="user-avatar">
            <img src="@/assets/avatar.jpg" :alt="authStore.user?.name" />
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <span class="user-email">{{ authStore.user?.email }}</span>
          </div>
        </div>
        <button @click="logout" class="nav-item logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-bar">
        <div class="page-title">
          <h1>Rifas em Destaque</h1>
        </div>
        <div class="header-actions">
          <button class="btn-icon">
            <i class="fas fa-search"></i>
          </button>
          <button class="btn-icon">
            <i class="fas fa-bell"></i>
          </button>
        </div>
      </header>

      <div class="dashboard-content">
        <!-- Featured Raffles Section -->
        <section class="featured-raffles">
          <div class="raffle-grid">
            <RaffleCard
              v-for="raffle in featuredRaffles"
              :key="raffle.id"
              :raffle="raffle"
              @select-quote="navigateToRaffle(raffle.id)"
            />
          </div>
        </section>

        <!-- How it Works Section -->
        <section class="how-it-works">
          <h2>Como Funciona</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-icon">
                <i class="fas fa-search"></i>
              </div>
              <div class="step-content">
                <h3>1. Escolha uma Rifa</h3>
                <p>Navegue entre as rifas disponíveis e escolha a que mais te interessar</p>
              </div>
            </div>
            
            <div class="step-card">
              <div class="step-icon">
                <i class="fas fa-ticket-alt"></i>
              </div>
              <div class="step-content">
                <h3>2. Selecione seus Números</h3>
                <p>Escolha quantos números desejar para aumentar suas chances</p>
              </div>
            </div>
            
            <div class="step-card">
              <div class="step-icon">
                <i class="fas fa-credit-card"></i>
              </div>
              <div class="step-content">
                <h3>3. Faça o Pagamento</h3>
                <p>Pague de forma segura com cartão de crédito ou PIX</p>
              </div>
            </div>
            
            <div class="step-card">
              <div class="step-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="step-content">
                <h3>4. Aguarde o Sorteio</h3>
                <p>Acompanhe o sorteio ao vivo e boa sorte!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import RaffleCard from '../components/RaffleCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const featuredRaffles = ref([]);

onMounted(() => {
  featuredRaffles.value = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'iPhone 15 Pro Max 256GB, Cor: Titânio Natural',
      image_url: '/images/iphone.jpg',
      quote_price: 10.00,
      total_quotes: 1000,
      sold_quotes: 150,
      status: 'active'
    },
    {
      id: 2,
      name: 'PlayStation 5',
      description: 'Console PS5 + 2 Controles + 3 Jogos',
      image_url: '/images/ps5.jpg',
      quote_price: 5.00,
      total_quotes: 2000,
      sold_quotes: 800,
      status: 'active'
    }
  ];
});

const navigateToRaffle = (raffleId) => {
  router.push(`/rifas/${raffleId}`);
};

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  width: 280px;
  background-color: #2d1b69;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.logo {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.menu-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  gap: 1rem;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item i {
  width: 20px;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.user-config {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: white;
}

.user-email {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.logout-btn {
  width: 100%;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title h1 {
  font-size: 1.5rem;
  color: #2d1b69;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: rgba(45, 27, 105, 0.1);
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dashboard-content {
  padding: 1rem;
}

.featured-raffles {
  margin-bottom: 3rem;
}

.raffle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.how-it-works h2 {
  text-align: center;
  color: #2d1b69;
  margin-bottom: 2rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.step-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #2d1b69;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d1b69;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 1rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
