<template>
  <header class="header">
    <span>🔵 KwikPost</span>
    <button 
      v-if="sessionStore.isLoggedIn" 
      class="btn new-post"
      @click="goToNewPost"
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
}

.btn.new-post {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>