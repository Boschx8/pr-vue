<template>
  <div>
    <h1 class="title-section">{{ isEditMode ? 'Edit post' : 'New post' }}</h1>
    
    <div class="form-post">
      <img 
        :src="sessionStore.user?.avatar || sessionStore.user?.profileImg"
        :alt="sessionStore.user?.username"
        class="form-post__image"
      >
      
      <form class="form-post__form" @submit.prevent="handleSubmit">
        <textarea
          v-model="content"
          placeholder="What are you thinking about?"
          rows="5"
          required
          :disabled="loading"
          maxlength="280"
        ></textarea>
        
        <div class="form-actions">
          <span class="char-count" :class="{ 'near-limit': content.length > 250 }">
            {{ content.length }}/280
          </span>
          
          <button 
            type="submit" 
            class="btn btn--cta btn--share"
            :disabled="loading || content.trim().length === 0"
          >
            {{ loading ? 'Enviant...' : 'Share' }}
          </button>
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import api from '@/services/api'

export default {
  name: 'PostFormView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const sessionStore = useSessionStore()
    
    const content = ref('')
    const isEditMode = ref(false)
    const loading = ref(false)
    const error = ref('')
    
    const loadPost = async () => {
      if (route.params.id) {
        isEditMode.value = true
        loading.value = true
        try {
          const response = await api.getPost(route.params.id)
          
          // Verificar que l'usuari és el propietari
          const postData = response.data.post || response.data
          if (postData.user.username !== sessionStore.user?.username) {
            error.value = 'You can only edit your own posts'
            setTimeout(() => router.push('/'), 2000)
          }
          
          content.value = postData.content
        } catch (err) {
          console.error('Error loading post:', err)
          error.value = 'The post could not be loaded'
        } finally {
          loading.value = false
        }
      }
    }
    
    const handleSubmit = async () => {
      if (!content.value.trim()) {
        error.value = 'The content cannot be empty'
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        let response
        
        if (isEditMode.value) {
          response = await api.updatePost(route.params.id, content.value)
        } else {
          response = await api.createPost(content.value)
        }
        
        // Anar al detall del post
        // L'API pot retornar l'id de diferents maneres
        const postId = response.data.id || response.data.post?.id || route.params.id
        router.push(`/post/${postId}`)
      } catch (err) {
        console.error('Error saving post:', err)
        error.value = 'The post could not be saved'
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadPost()
    })
    
    return {
      sessionStore,
      content,
      isEditMode,
      loading,
      error,
      handleSubmit
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

.form-post {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.form-post__image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.form-post__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-post__form textarea {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
}

.form-post__form textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: var(--grey-color);
}

.char-count.near-limit {
  color: orange;
}

.btn--share {
  align-self: flex-end;
}

.btn--share:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}
</style>