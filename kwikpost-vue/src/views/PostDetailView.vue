<template>
  <div v-if="post">
    <div class="main-post">
      <PostComponent :post="post" />
      
      <div v-if="isOwnPost" class="actions-wrapper">
        <button class="btn" @click="deletePost">🗑 Delete</button>
        <button class="btn" @click="editPost">✎ Edit</button>
      </div>
    </div>
    
    <div v-if="replies.length > 0" class="replies-section">
      <h3 class="replies-title">Respostes</h3>
      <ul class="replies-list">
        <li v-for="reply in replies" :key="reply.id">
          <PostComponent :post="reply" />
        </li>
      </ul>
    </div>
  </div>
  
  <div v-else class="loading">
    {{ error || 'Carregant...' }}
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import PostComponent from '@/components/PostComponent.vue'
import api from '@/services/api'

export default {
  name: 'PostDetailView',
  components: {
    PostComponent
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const sessionStore = useSessionStore()
    
    const post = ref(null)
    const replies = ref([])
    const error = ref('')
    
    const isOwnPost = computed(() => {
      return post.value?.user.username === sessionStore.user?.username
    })
    
    const loadPost = async () => {
      try {
        const response = await api.getPost(route.params.id)
        
        if (response.data.post) {
          post.value = response.data.post
          replies.value = response.data.replies || []
        } else if (response.data.result) {
          post.value = response.data.result
          replies.value = response.data.replies || []
        } else {
          post.value = response.data
          replies.value = response.data.replies || []
        }
        
        console.log('Post loaded:', post.value.id)
        
      } catch (err) {
        console.error('Error loading post:', err)
        
        if (err.response?.status === 404) {
          error.value = 'Post not found'
          setTimeout(() => router.push('/'), 2000)
        } else if (err.response?.status === 401) {
          error.value = 'You must be logged in to view this post'
          setTimeout(() => router.push('/login'), 2000)
        } else {
          error.value = 'Could not load post'
        }
      }
    }
    
    const deletePost = async () => {
      if (confirm('Are you sure you want to delete this post?')) {
        try {
          await api.deletePost(route.params.id)
          router.push('/')
        } catch (err) {
          console.error('Error deleteing post', err)
          alert('The post could not be deleted.')
        }
      }
    }
    
    const editPost = () => {
      router.push(`/post/form/${route.params.id}`)
    }
    
    onMounted(() => {
      loadPost()
    })
    
    return {
      post,
      replies,
      error,
      isOwnPost,
      deletePost,
      editPost
    }
  }
}
</script>

<style scoped>
.main-post {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px;
  background: white;
}

.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 10px;
  margin-right: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--grey-color);
}

.replies-section {
  margin-top: 20px;
}

.replies-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--secondary-color);
  padding-left: 20px;
}

.replies-list {
  margin-left: 20px;
  list-style: none;
  padding: 0;
}

.replies-list li:not(:last-child) {
  border-bottom: 1px solid #ddd;
}
</style>