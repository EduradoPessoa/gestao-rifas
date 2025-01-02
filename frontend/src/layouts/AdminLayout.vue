<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    
    <main class="pl-64">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="px-6 py-4 flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-gray-900">
            <slot name="header">Dashboard</slot>
          </h1>
          
          <div class="flex items-center gap-4">
            <!-- Search -->
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                placeholder="Buscar..." 
                class="pl-10 input max-w-xs bg-gray-50"
                v-model="searchQuery"
                @input="$emit('search', searchQuery)"
              >
            </div>
            
            <!-- Actions -->
            <slot name="actions"></slot>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="p-6">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const searchQuery = ref('')

defineEmits(['search'])
</script>
