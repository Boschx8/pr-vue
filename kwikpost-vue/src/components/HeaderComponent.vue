<template>
  <header class="header">
    <span class="header-title">🔵 KwikPost</span>
    <button 
      v-if="sessionStore.isLoggedIn" 
      class="btn btn--circle new-post"
      @click="goToNewPost"
      title="Crear nou post"
    >
      ✎
    </button>
  </header>
</template>

<script>
import { useSessionStore } from '@/stores/session'
import { useRouter } from 'vue-router'

export default {
  name: 'HeaderComponent',
  setup() {
    const sessionStore = useSessionStore()
    const router = useRouter()
    
    const goToNewPost = () => {
      router.push('/post/form')
    }
    
    return {
      sessionStore,
      goToNewPost
    }
  }
}
</script>

<style scoped>
.header {
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0px 4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
  position: relative;
  background: white;
  border-radius: 20px 20px 0 0;
}

.header-title {
  color: var(--secondary-color);
}

.btn.new-post {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--primary-color);
  color: white;
  transition: all 0.3s ease;
}

.btn.new-post:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
}
</style>