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
          :disabled="loading"
        >
      </div>
      
      <div class="input-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          v-model="password"
          type="password"
          placeholder="a1b2c3d4"
          required
          :disabled="loading"
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import api from '@/services/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const sessionStore = useSessionStore()
    
    const username = ref('johndoe') 
    const password = ref('a1b2c3d4') 
    const error = ref('')
    const loading = ref(false)
    const debugInfo = ref(true)
    const testingToken = ref(false)
    const tokenTestResult = ref(null)
    
    const handleLogin = async () => {
      if (!username.value || !password.value) {
        error.value = 'Please fill in both fields.'
        return
      }
      
      error.value = ''
      loading.value = true
      tokenTestResult.value = null
      
      try {
        const response = await api.login(username.value, password.value)

        
   
        const userData = response.data.user || response.data
        const token = response.data.token || response.data.access_token
        
        
        if (!userData) {
          throw new Error('Cannot retrieve user data from response')
        }
        
        if (!token) {
          throw new Error('Cannot retrieve token from response')
        }
        
        // Mapejar els camps correctament
        const userDataMapped = {
          id: userData.id,
          username: userData.username,
          name: userData.name ? 
            `${userData.name} ${userData.surname || ''}`.trim() : 
            userData.username,
          avatar: userData.profileImg || userData.avatar || 'https://via.placeholder.com/100',
          bio: userData.bio || `Hi! I am ${userData.name || userData.username}`,
          createdAt: userData.registrationDate || userData.createdAt || new Date().toISOString()
        }
        
        
        // Guardar a la store
        sessionStore.setSession(userDataMapped, token)
        
        // Test immediat del token
        await testTokenImmediately()
        
        // Redirigir
        const redirectPath = route.query.redirect || `/profile/${userData.username}`
        router.push(redirectPath)
        
      } catch (err) {
        
        if (err.response?.status === 401) {
          error.value = 'Invalid username or password'
        } else if (err.response?.status === 404) {
          error.value = 'User not found'
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Connection error. Please try again later.'
        }
      } finally {
        loading.value = false
      }
    }
    
    const testToken = async () => {
      await testTokenImmediately()
    }
    
    const testTokenImmediately = async () => {
      testingToken.value = true
      tokenTestResult.value = null
      
      try {
        const response = await api.getUser(sessionStore.user.username)
        tokenTestResult.value = {
          success: true,
          message: 'Valid token!'
        }
      } catch (err) {
        console.error('Invalid token:', err)
        tokenTestResult.value = {
          success: false,
          message: `Invalid token: ${err.response?.status} ${err.response?.statusText}`
        }
      } finally {
        testingToken.value = false
      }
    }
    
    onMounted(() => {
      if (sessionStore.isLoggedIn) {
        router.push(`/profile/${sessionStore.user.username}`)
      }
    })
    
    return {
      username,
      password,
      error,
      loading,
      debugInfo,
      sessionStore,
      testingToken,
      tokenTestResult,
      handleLogin,
      testToken
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

.login-info, .debug-info {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.debug-info {
  background-color: #fff3cd;
  border-color: #ffeaa7;
}

.debug-info h3 {
  margin: 0 0 10px 0;
  color: var(--secondary-color);
}

.login-info code {
  background-color: #e9ecef;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.test-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.test-section h3 {
  margin: 0 0 10px 0;
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
  font-weight: 500;
}

input {
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 0 10px;
  min-height: 2rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ffcccc;
}

.success {
  color: green;
  font-size: 0.9rem;
  text-align: center;
  background-color: #e6ffe6;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccffcc;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>