<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo -->
    <div class="p-6">
      <router-link to="/" class="flex items-center gap-2 text-primary-600">
        <img src="../assets/logo.png" alt="Logo" class="h-8 w-8" />
        <span class="text-xl font-semibold">Rifas Online</span>
      </router-link>
    </div>

    <!-- User Profile -->
    <div class="px-6 py-4 border-t border-b border-gray-200">
      <div class="flex items-center gap-3">
        <img 
          :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')" 
          :alt="user?.name"
          class="h-10 w-10 rounded-full"
        />
        <div>
          <h3 class="font-medium text-gray-900">{{ user?.name || 'Usuário' }}</h3>
          <p class="text-sm text-gray-500">{{ user?.email || 'usuario@email.com' }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <router-link to="/dashboard" class="sidebar-link" active-class="active">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </router-link>
      
      <router-link to="/rifas" class="sidebar-link" active-class="active">
        <i class="fas fa-ticket-alt"></i>
        <span>Minhas Rifas</span>
      </router-link>
      
      <router-link to="/admin/rifas" v-if="isAdmin" class="sidebar-link" active-class="active">
        <i class="fas fa-cog"></i>
        <span>Gerenciar Rifas</span>
      </router-link>
      
      <router-link to="/backups" class="sidebar-link" active-class="active">
        <i class="fas fa-database"></i>
        <span>Backups</span>
      </router-link>
      
      <router-link to="/support" class="sidebar-link" active-class="active">
        <i class="fas fa-headset"></i>
        <span>Suporte</span>
      </router-link>
    </nav>

    <!-- Logout Button -->
    <div class="p-4 border-t border-gray-200">
      <button @click="logout" class="w-full btn btn-outline flex items-center justify-center gap-2">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

const logout = async () => {
  await authStore.logout()
  router.push('/auth')
}
</script>
