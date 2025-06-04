<template>
  <div class="form-post">
    <img 
      :src="sessionStore.user?.avatar"
      :alt="sessionStore.user?.username"
      class="form-post__image"
    >
    
    <form class="form-post__form" @submit.prevent="handleSubmit">
      <textarea
        v-model="content"
        placeholder="Started learning a new language"
        rows="5"
        required
      ></textarea>
      
      <button type="submit" class="btn btn--cta btn--share">
        Share
      </button>
    </form>
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
    
    const loadPost = async () => {
      if (route.params.id) {
        isEditMode.value = true
        try {
          const response = await api.getPost(route.params.id)
          content.value = response.data.post.content
        } catch (error) {
          console.error('Error carregant post:', error)
        }
      }
    }
    
    const handleSubmit = async () => {
      try {
        let response
        
        if (isEditMode.value) {
          response = await api.updatePost(route.params.id, content.value)
        } else {
          response = await api.createPost(content.value)
        }
        
        // Anar al detall del post
        router.push(`/post/${response.data.id}`)
      } catch (error) {
        console.error('Error guardant post:', error)
      }
    }
    
    onMounted(() => {
      loadPost()
    })
    
    return {
      sessionStore,
      content,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.form-post {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  gap: 10px;
}

.form-post__image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.form-post__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-post__form .btn--share {
  align-self: flex-end;
}

.form-post__form textarea {
  display: block;
  width: 100%;
  padding: 10px;
  border: 0;
  resize: none;
  font-family: inherit;
}
</style>