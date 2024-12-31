<template>
  <div class="home">
    <header class="hero">
      <div class="hero__content">
        <h1>Rifas Online</h1>
        <p>Participe de sorteios exclusivos com total transparência e segurança</p>
        <router-link to="/rifas" class="btn btn--primary">Ver Rifas Disponíveis</router-link>
      </div>
    </header>

    <section class="featured-raffles">
      <h2>Rifas em Destaque</h2>
      <div class="raffle-grid">
        <RaffleCard
          v-for="raffle in featuredRaffles"
          :key="raffle.id"
          :raffle="raffle"
          @select-quote="navigateToRaffle(raffle.id)"
        />
      </div>
    </section>

    <section class="how-it-works">
      <h2>Como Funciona</h2>
      <div class="steps-grid">
        <div class="step">
          <i class="fas fa-search"></i>
          <h3>1. Escolha uma Rifa</h3>
          <p>Navegue entre as rifas disponíveis e escolha a que mais te interessar</p>
        </div>
        <div class="step">
          <i class="fas fa-ticket-alt"></i>
          <h3>2. Selecione seus Números</h3>
          <p>Escolha quantos números desejar para aumentar suas chances</p>
        </div>
        <div class="step">
          <i class="fas fa-credit-card"></i>
          <h3>3. Faça o Pagamento</h3>
          <p>Pague de forma segura com cartão de crédito ou PIX</p>
        </div>
        <div class="step">
          <i class="fas fa-trophy"></i>
          <h3>4. Aguarde o Sorteio</h3>
          <p>Acompanhe o sorteio ao vivo e boa sorte!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RaffleCard from '../components/RaffleCard.vue'

const router = useRouter()
const featuredRaffles = ref([])

// Simulando dados de rifas em destaque
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
    },
    // Adicione mais rifas conforme necessário
  ])
})

const navigateToRaffle = (raffleId) => {
  router.push(`/rifas/${raffleId}`)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(rgba(0, 109, 119, 0.9), rgba(0, 109, 119, 0.9)),
              url('/images/hero-bg.jpg') center/cover;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: var(--spacing-xl);
}

.hero__content {
  max-width: 800px;
}

.hero h1 {
  font-family: var(--font-heading);
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-lg);
}

.featured-raffles,
.how-it-works {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-family: var(--font-heading);
  color: var(--color-neutral);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.raffle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  text-align: center;
}

.step {
  padding: var(--spacing-lg);
}

.step i {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.step h3 {
  font-family: var(--font-heading);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-sm);
}

.btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-family: var(--font-interactive);
  text-decoration: none;
  transition: var(--transition-fast);
}

.btn--primary {
  background: var(--color-secondary);
  color: var(--color-neutral);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .steps-grid {
    gap: var(--spacing-lg);
  }
}
</style>
