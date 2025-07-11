<template>
  <div class="posts-list">
    <h1 class="title-section">Feed</h1>
    
    <div v-if="loading && posts.length === 0" class="loading">
      Carregant...
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="tryAgain" class="btn btn--cta" style="margin-top: 10px;">
        Prova de nou
      </button>
    </div>
    
    <ul v-else-if="posts.length > 0">
      <li v-for="post in posts" :key="post.id" class="post-item">
        <PostComponent :post="post" />
      </li>
    </ul>
    
    <div v-else-if="!loading" class="no-posts">
      No hi ha posts disponibles
    </div>
    
    <button 
      v-if="posts.length < totalPosts && !loading && !error"
      class="btn load-more"
      @click="loadMorePosts"
    >
      Load more ({{ posts.length }}/{{ totalPosts }})
    </button>
    
    <div v-if="loading && posts.length > 0" class="loading">
      Carregant més posts...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import PostComponent from '@/components/PostComponent.vue'
import api from '@/services/api'

export default {
  name: 'HomeView',
  components: {
    PostComponent
  },
  setup() {
    const router = useRouter()
    const sessionStore = useSessionStore()
    const posts = ref([])
    const loading = ref(false)
    const error = ref('')
    const totalPosts = ref(0)
    const currentOffset = ref(0)
    const limit = 10
    
    const processPostData = (rawPost) => {

      if (typeof rawPost === 'string') {
        try {
          const parsed = JSON.parse(rawPost)
          return processPostData(parsed) 
        } catch (e) {
          console.error('Error parsejant post:', e)
          return null
        }
      }
      

      if (typeof rawPost === 'object' && rawPost !== null) {
        return {
          id: rawPost.id || rawPost.postId,
          content: rawPost.content || rawPost.text || rawPost.message,
          createdAt: rawPost.createdAt || rawPost.publishDate || rawPost.date,
          likes: rawPost.nLikes || rawPost.likes || 0,
          replies: rawPost.nReplies || rawPost.replies || rawPost.comments || 0,
          postId: rawPost.postId, 
          user: {
            id: rawPost.userId || rawPost.user?.id,
            username: rawPost.username || rawPost.user?.username,
            name: rawPost.name || rawPost.user?.name || rawPost.username || rawPost.user?.username,
            avatar: rawPost.profileImg || rawPost.user?.profileImg || rawPost.user?.avatar || 'https://via.placeholder.com/50'
          }
        }
      }
      
      return null
    }
    
    const loadPosts = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const response = await api.getPosts(limit, currentOffset.value)
        

        let rawPosts = []
        let total = 0
        
        if (response.data.result && Array.isArray(response.data.result)) {
          rawPosts = response.data.result
          total = response.data.paginator?.total || 0
        } else if (response.data.posts && Array.isArray(response.data.posts)) {
          rawPosts = response.data.posts
          total = response.data.total || 0
        } else if (Array.isArray(response.data)) {
          rawPosts = response.data
          total = rawPosts.length
        }
        
        const processedPosts = rawPosts
          .map(processPostData)
          .filter(post => post !== null) 
               

        posts.value = [...posts.value, ...processedPosts]
        totalPosts.value = total
        currentOffset.value += limit
        
        if (processedPosts.length === 0 && posts.value.length === 0) {
          error.value = 'The are no posts available'
        }
        
      } catch (err) {
        console.error('Error loading posts:', err)
        
        if (err.response?.status === 401) {
          error.value = 'You need to log in to see posts'
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else if (err.response?.status === 404) {
          error.value = 'No posts found'
        } else if (err.response?.data?.message) {
          error.value = `API error: ${err.response.data.message}`
        } else {
          error.value = `Error loading posts: ${err.message}`
        }
      } finally {
        loading.value = false
      }
    }
    
    const loadMorePosts = () => {
      if (!loading.value && posts.value.length < totalPosts.value) {
        loadPosts()
      }
    }
    
    const tryAgain = () => {
      posts.value = []
      currentOffset.value = 0
      totalPosts.value = 0
      loadPosts()
    }
    
    onMounted(() => {
      loadPosts()
    })
    
    return {
      posts,
      loading,
      error,
      totalPosts,
      sessionStore,
      loadMorePosts,
      tryAgain
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

.error-message {
  text-align: center;
  padding: 20px;
  color: red;
  background-color: #ffe6e6;
  border-radius: 8px;
  margin: 20px;
  border: 1px solid #ffcccc;
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