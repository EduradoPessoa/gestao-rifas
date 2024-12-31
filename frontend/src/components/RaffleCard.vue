<template>
  <div class="raffle-card" :class="{ 'raffle-card--active': isActive }">
    <img :src="raffle.image_url" :alt="raffle.name" class="raffle-card__image">
    <div class="raffle-card__content">
      <h3 class="raffle-card__title">{{ raffle.name }}</h3>
      <p class="raffle-card__description">{{ raffle.description }}</p>
      <div class="raffle-card__info">
        <span class="raffle-card__price">R$ {{ formatPrice(raffle.quote_price) }}</span>
        <span class="raffle-card__quotes">{{ availableQuotes }} / {{ raffle.total_quotes }}</span>
      </div>
      <button 
        class="raffle-card__button"
        :disabled="!isActive"
        @click="$emit('select-quote')"
      >
        Escolher Número
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  raffle: {
    type: Object,
    required: true
  }
})

const isActive = computed(() => props.raffle.status === 'active')
const availableQuotes = computed(() => props.raffle.total_quotes - props.raffle.sold_quotes)

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}
</script>

<style scoped>
.raffle-card {
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition-normal);
}

.raffle-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.raffle-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.raffle-card__content {
  padding: var(--spacing-md);
}

.raffle-card__title {
  font-family: var(--font-heading);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-sm);
}

.raffle-card__description {
  font-family: var(--font-body);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.raffle-card__info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.raffle-card__price {
  color: var(--color-primary);
  font-weight: bold;
}

.raffle-card__button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-interactive);
  cursor: pointer;
  transition: var(--transition-fast);
}

.raffle-card__button:hover:not(:disabled) {
  background: var(--color-secondary);
}

.raffle-card__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
