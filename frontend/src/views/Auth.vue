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

        <div class="form-footer">
          <a href="#" class="forgot-password" @click.prevent="forgotPassword">
            Esqueceu sua senha?
          </a>
          <button 
            type="submit" 
            class="btn btn--primary"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-name">Nome Completo</label>
          <input
            id="register-name"
            type="text"
            v-model="registerForm.name"
            required
            placeholder="Seu nome completo"
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
            placeholder="(00) 00000-0000"
            v-mask="'(##) #####-####'"
          >
        </div>

        <div class="form-group">
          <label for="register-password">Senha</label>
          <input
            id="register-password"
            type="password"
            v-model="registerForm.password"
            required
            placeholder="Crie uma senha forte"
          >
        </div>

        <div class="form-group">
          <label for="register-password-confirm">Confirme a Senha</label>
          <input
            id="register-password-confirm"
            type="password"
            v-model="registerForm.passwordConfirm"
            required
            placeholder="Digite a senha novamente"
          >
        </div>

        <button 
          type="submit" 
          class="btn btn--primary"
          :disabled="authStore.loading || !isPasswordMatch"
        >
          {{ authStore.loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <!-- Error Message -->
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { vMask } from '@vuelidate/validators'

const router = useRouter()
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
  password: '',
  passwordConfirm: ''
})

const isPasswordMatch = computed(() => {
  return registerForm.value.password === registerForm.value.passwordConfirm
})

const handleLogin = async () => {
  try {
    await authStore.login(loginForm.value)
    router.push('/perfil')
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

const handleRegister = async () => {
  if (!isPasswordMatch.value) {
    authStore.error = 'As senhas não conferem'
    return
  }

  try {
    await authStore.register(registerForm.value)
    router.push('/perfil')
  } catch (error) {
    console.error('Erro no cadastro:', error)
  }
}

const forgotPassword = async () => {
  if (!loginForm.value.email) {
    authStore.error = 'Digite seu e-mail para recuperar a senha'
    return
  }

  try {
    await authStore.forgotPassword(loginForm.value.email)
    alert('Enviamos um e-mail com instruções para recuperar sua senha')
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
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.auth-box {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.auth-tabs {
  display: flex;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: var(--spacing-md);
  background: none;
  border: none;
  font-family: var(--font-interactive);
  font-size: 1.1rem;
  color: var(--color-neutral);
  cursor: pointer;
  transition: var(--transition-fast);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: -2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-family: var(--font-body);
  color: var(--color-neutral);
  font-size: 0.9rem;
}

.form-group input {
  padding: var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-body);
  transition: var(--transition-fast);
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 109, 119, 0.1);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-interactive);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-secondary);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: #fff2f2;
  border: 1px solid #ffcdd2;
  color: #d32f2f;
  border-radius: var(--border-radius-sm);
  text-align: center;
}

@media (max-width: 768px) {
  .auth-box {
    padding: var(--spacing-md);
  }

  .form-footer {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
}
</style>
