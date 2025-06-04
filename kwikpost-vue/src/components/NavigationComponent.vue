<template>
  <nav class="menu">
    <router-link to="/" class="menu-link" :class="{ active: $route.name === 'home' }">
      🏠︎
    </router-link>
    
    <router-link 
      v-if="!sessionStore.isLoggedIn" 
      to="/login" 
      class="menu-link"
      :class="{ active: $route.name === 'login' }"
    >
      𓉞
    </router-link>
    
    <router-link 
      v-else
      :to="`/profile/${sessionStore.user?.username}`" 
      class="menu-link"
      :class="{ active: $route.name === 'profile' }"
    >
      <img 
        :src="sessionStore.user?.avatar" 
        :alt="sessionStore.user?.username"
        class="profile-img"
      >
    </router-link>
  </nav>
</template>

<script>
import { useSessionStore } from '@/stores/session'

export default {
  name: 'NavigationComponent',
  setup() {
    const sessionStore = useSessionStore()
    
    return {
      sessionStore
    }
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-top: 1px solid #ddd;
  background: white;
  border-end-end-radius: 20px;
  border-end-start-radius: 20px;
  box-shadow: 0px -4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
}

.menu-link {
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--grey-color);
}

.menu-link.active {
  color: var(--primary-color);
}

.profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>