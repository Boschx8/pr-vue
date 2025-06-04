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
      
      <button type="submit" class="btn btn--cta">
        Login
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
    
    const handleLogin = async () => {
      error.value = ''
      
      try {
        const response = await api.login(username.value, password.value)
        
        // Guardar dades a la store
        sessionStore.setSession(response.data.user, response.data.token)
        
        // Redirigir al perfil
        router.push(`/profile/${response.data.user.username}`)
      } catch (err) {
        error.value = 'Credencials incorrectes'
        console.error('Error login:', err)
      }
    }
    
    return {
      username,
      password,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
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

.error {
  color: red;
  font-size: 0.8rem;
}
</style>