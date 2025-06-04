<template>
  <div class="posts-list">
    <h1>Feed</h1>
    
    <div v-if="loading">Carregant...</div>
    
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        <PostComponent :post="post" />
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
}

.post {
  margin-top: 10px;
}

.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
}

ul {
  list-style: none;
  padding: 0;
}
</style>