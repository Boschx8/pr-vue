<template>
  <div v-if="post">
    <div class="main-post">
      <PostComponent :post="post" />
      
      <div v-if="isOwnPost" class="actions-wrapper">
        <button class="btn" @click="deletePost">🗑 Esborrar</button>
        <button class="btn" @click="editPost">✎ Editar</button>
      </div>
    </div>
    
    <ul v-if="replies.length > 0" class="replies-list">
      <li v-for="reply in replies" :key="reply.id">
        <PostComponent :post="reply" />
      </li>
    </ul>
  </div>
  
  <div v-else>
    Carregant...
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
    
    const isOwnPost = computed(() => {
      return post.value?.user.username === sessionStore.user?.username
    })
    
    const loadPost = async () => {
      try {
        const response = await api.getPost(route.params.id)
        post.value = response.data.post
        replies.value = response.data.replies || []
      } catch (error) {
        console.error('Error carregant post:', error)
      }
    }
    
    const deletePost = async () => {
      if (confirm('Segur que vols esborrar aquest post?')) {
        try {
          await api.deletePost(route.params.id)
          router.push('/')
        } catch (error) {
          console.error('Error esborrant post:', error)
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
}

.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 10px;
  margin-right: 10px;
}

.replies-list {
  margin-left: 20px;
  margin-top: 20px;
}

.replies-list li:not(:last-child) {
  border-bottom: 1px solid #ddd;
}
</style>