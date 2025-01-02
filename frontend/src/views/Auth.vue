<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-tabs">
        <button 
          :class="['tab-btn', { active: isLogin }]"
          @click="isLogin = true"
        >
          Login
        </button>
        <button 
          :class="['tab-btn', { active: !isLogin }]"
          @click="isLogin = false"
        >
          Cadastro
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            v-model="loginForm.email"
            required
            placeholder="seu@email.com"
          >
        </div>

        <div class="form-group">
          <label for="login-password">Senha</label>
          <input
            id="login-password"
            type="password"
            v-model="loginForm.password"
            required
            placeholder="Sua senha"
          >
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <div class="form-footer">
          <a href="#" class="forgot-password" @click.prevent="forgotPassword">
            Esqueceu sua senha?
          </a>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-name">Nome</label>
          <input
            id="register-name"
            type="text"
            v-model="registerForm.name"
            required
            placeholder="Seu nome"
          >
        </div>

        <div class="form-group">
          <label for="register-email">E-mail</label>
          <input
            id="register-email"
            type="email"
            v-model="registerForm.email"
            required
            placeholder="seu@email.com"
          >
        </div>

        <div class="form-group">
          <label for="register-phone">Telefone</label>
          <input
            id="register-phone"
            type="tel"
            v-model="registerForm.phone"
            required
            placeholder="(11) 99999-9999"
          >
        </div>

        <div class="form-group">
          <label for="register-password">Senha</label>
          <input
            id="register-password"
            type="password"
            v-model="registerForm.password"
            required
            placeholder="Sua senha"
          >
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(loginForm.value)
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

const handleRegister = async () => {
  try {
    await authStore.register(registerForm.value)
  } catch (error) {
    console.error('Erro no registro:', error)
  }
}

const forgotPassword = async () => {
  const email = loginForm.value.email
  if (!email) {
    authStore.error = 'Por favor, insira seu e-mail para recuperar a senha'
    return
  }

  try {
    await authStore.forgotPassword(email)
    alert('Instruções de recuperação enviadas para seu e-mail')
  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #8B5CF6;
  border-bottom: 2px solid #8B5CF6;
  margin-bottom: -2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #8B5CF6;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #8B5CF6;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-btn {
  background: #8B5CF6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #7C3AED;
}

.submit-btn:disabled {
  background: #A78BFA;
  cursor: not-allowed;
}

.error-message {
  color: #DC2626;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #FEE2E2;
  border-radius: 4px;
}
</style>
