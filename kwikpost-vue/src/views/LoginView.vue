<template>
  <div>
    <h1 class="title-section">Login</h1>
    
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="username">Username:</label>
        <input 
          id="username"
          v-model="username"
          type="text"
          placeholder="johndoe"
          required
        >
      </div>
      
      <div class="input-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••"
          required
        >
      </div>
      
      <p v-if="error" class="error">{{ error }}</p>
      
      <button type="submit" class="btn btn--cta" :disabled="loading">
        {{ loading ? 'Iniciant sessió...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import api from '@/services/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const sessionStore = useSessionStore()
    
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    
    const handleLogin = async () => {
      error.value = ''
      loading.value = true
      
      try {
        const response = await api.login(username.value, password.value)
        console.log('Login response:', response.data) // Per debugar
        
        // Guardar dades a la store
        // L'API pot retornar les dades en diferents formats
        const userData = response.data.user || response.data
        const token = response.data.token || response.data.access_token
        
        if (!token) {
          throw new Error('No s\'ha rebut cap token')
        }
        
        // Mapejar els camps correctament
        const userDataMapped = {
          ...userData,
          avatar: userData.profileImg || userData.avatar,
          createdAt: userData.registrationDate || userData.createdAt
        }
        
        sessionStore.setSession(userDataMapped, token)
        
        // Redirigir al perfil
        router.push(`/profile/${userData.username}`)
      } catch (err) {
        error.value = err.response?.data?.message || 'Credencials incorrectes'
        console.error('Error login:', err)
      } finally {
        loading.value = false
      }
    }
    
    return {
      username,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.title-section {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--secondary-color);
}

form {
  display: grid;
  place-items: center;
  gap: 20px;
}

.input-group {
  display: grid;
  place-items: center;
  gap: 10px;
  width: 100%;
  max-width: 300px;
}

label {
  font-size: 1rem;
}

input {
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 0 10px;
  min-height: 2rem;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>