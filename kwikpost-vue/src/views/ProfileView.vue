<template>
  <div>
    <div class="user-info" v-if="user">
      <img 
        :src="user.avatar"
        :alt="user.username"
        class="user-info__avatar"
      >
      <h2>{{ user.name }}</h2>
      <span class="has-color-light">@{{ user.username }}</span>
      <p>{{ user.bio }}</p>
      <time class="has-color-light has-text-small">
        Joined on {{ formatJoinDate(user.createdAt) }}
      </time>
      
      <button 
        v-if="isOwnProfile"
        class="btn--logout"
        @click="handleLogout"
        title="Logout"
      >
        🗣
      </button>
    </div>
    
    <div v-if="loading" class="loading">Carregant...</div>
    
    <ul v-else class="posts-list">
      <li v-for="post in posts" :key="post.id">
        <PostComponent :post="post" :show-user-info="false" />
      </li>
    </ul>
    
    <button 
      v-if="posts.length < totalPosts && !loading"
      class="btn load-more"
      @click="loadMorePosts"
    >
      Load more
    </button>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import PostComponent from '@/components/PostComponent.vue'
import api from '@/services/api'

export default {
  name: 'ProfileView',
  components: {
    PostComponent
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const sessionStore = useSessionStore()
    
    const user = ref(null)
    const posts = ref([])
    const loading = ref(false)
    const totalPosts = ref(0)
    const currentOffset = ref(0)
    const limit = 10
    
    const isOwnProfile = computed(() => {
      return sessionStore.user?.username === route.params.username
    })
    
    const loadUserData = async () => {
      try {
        const response = await api.getUser(route.params.username)
        // Mapejar els camps correctament
        const userData = response.data
        user.value = {
          ...userData,
          avatar: userData.profileImg || userData.avatar,
          createdAt: userData.registrationDate || userData.createdAt,
          bio: userData.bio || `Hola! Sóc ${userData.name}`
        }
      } catch (error) {
        console.error('Error carregant usuari:', error)
      }
    }
    
    const loadUserPosts = async (reset = false) => {
      loading.value = true
      try {
        if (reset) {
          currentOffset.value = 0
          posts.value = []
        }
        
        const response = await api.getUserPosts(route.params.username, limit, currentOffset.value)
        posts.value = [...posts.value, ...response.data.posts]
        totalPosts.value = response.data.total
        currentOffset.value += limit
      } catch (error) {
        console.error('Error carregant posts:', error)
      } finally {
        loading.value = false
      }
    }
    
    const loadMorePosts = () => {
      loadUserPosts()
    }
    
    const handleLogout = () => {
      if (confirm('Segur que vols tancar la sessió?')) {
        sessionStore.clearSession()
        router.push('/')
      }
    }
    
    const formatJoinDate = (dateString) => {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    }
    
    // Recarregar dades quan canvia l'username
    watch(() => route.params.username, () => {
      if (route.name === 'profile') {
        loadUserData()
        loadUserPosts(true)
      }
    })
    
    onMounted(() => {
      loadUserData()
      loadUserPosts()
    })
    
    return {
      user,
      posts,
      loading,
      totalPosts,
      isOwnProfile,
      loadMorePosts,
      handleLogout,
      formatJoinDate
    }
  }
}
</script>

<style scoped>
.user-info {
  display: grid;
  place-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
  text-align: center;
}

.user-info__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.user-info h2 {
  margin: 5px 0;
}

.user-info p {
  margin: 10px 0;
  max-width: 80%;
}

.btn--logout {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background: none;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.btn--logout:hover {
  background-color: rgba(0,0,0,0.1);
}

.loading {
  text-align: center;
  padding: 20px;
  color: var(--grey-color);
}

.posts-list {
  margin-top: 20px;
}

.posts-list li:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
  display: block;
}
</style>