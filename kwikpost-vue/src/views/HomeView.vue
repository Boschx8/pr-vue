<template>
  <div class="posts-list">
    <h1 class="title-section">Feed</h1>
    
    <div v-if="loading && posts.length === 0" class="loading">
      Carregant...
    </div>
    
    <ul v-else-if="posts.length > 0">
      <li v-for="post in posts" :key="post.id" class="post-item">
        <PostComponent :post="post" />
      </li>
    </ul>
    
    <div v-else class="no-posts">
      No hi ha posts disponibles
    </div>
    
    <button 
      v-if="posts.length < totalPosts && !loading"
      class="btn load-more"
      @click="loadMorePosts"
    >
      Load more
    </button>
    
    <div v-if="loading && posts.length > 0" class="loading">
      Carregant més posts...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import PostComponent from '@/components/PostComponent.vue'
import api from '@/services/api'

export default {
  name: 'HomeView',
  components: {
    PostComponent
  },
  setup() {
    const posts = ref([])
    const loading = ref(false)
    const totalPosts = ref(0)
    const currentOffset = ref(0)
    const limit = 10
    
    const loadPosts = async () => {
      loading.value = true
      try {
        const response = await api.getPosts(limit, currentOffset.value)
        console.log('Response:', response.data) // Per debugar
        
        // Gestionar diferents formats de resposta
        let newPosts = []
        let total = 0
        
        if (response.data.posts && Array.isArray(response.data.posts)) {
          // Format: { posts: [...], total: X }
          newPosts = response.data.posts
          total = response.data.total || newPosts.length
        } else if (Array.isArray(response.data)) {
          // Format: [...] (array directe)
          newPosts = response.data
          total = response.data.length
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Format: { data: [...], total: X }
          newPosts = response.data.data
          total = response.data.total || newPosts.length
        }
        
        posts.value = [...posts.value, ...newPosts]
        totalPosts.value = total
        currentOffset.value += limit
      } catch (error) {
        console.error('Error carregant posts:', error)
        // Si és un 401, potser cal fer login
        if (error.response?.status === 401) {
          console.log('No autoritzat. Cal fer login.')
        }
      } finally {
        loading.value = false
      }
    }
    
    const loadMorePosts = () => {
      loadPosts()
    }
    
    onMounted(() => {
      loadPosts()
    })
    
    return {
      posts,
      loading,
      totalPosts,
      loadMorePosts
    }
  }
}
</script>

<style scoped>
.posts-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.title-section {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--secondary-color);
}

.loading {
  text-align: center;
  padding: 20px;
  color: var(--grey-color);
}

.no-posts {
  text-align: center;
  padding: 40px;
  color: var(--light-color);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  margin-top: 10px;
}

.post-item:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
  display: block;
}
</style>