<template>
  <article class="post" @click="handlePostClick">
    <div class="user-info" v-if="showUserInfo && postUser">
      <img 
        :src="postUser.avatar" 
        :alt="postUser.username"
        class="user-info__avatar"
        @click.stop="goToProfile"
      >
      <div class="user-info__user">
        <strong @click.stop="goToProfile">{{ postUser.name }}</strong>
        <span class="has-color-light has-text-small" @click.stop="goToProfile">
          @{{ postUser.username }}
        </span>
      </div>
    </div>
    
    <div class="post-detail">
      <p>{{ post.content || post.text }}</p>
      <time class="has-color-light has-text-small">
        {{ formatDate(post.createdAt || post.date) }}
      </time>
    </div>
    
    <div class="interactions">
      <span class="icon">❤ {{ post.likes || 0 }}</span>
      <span class="icon">💬 {{ post.replies || post.comments || 0 }}</span>
    </div>
  </article>
</template>

<script>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'PostComponent',
  props: {
    post: {
      type: Object,
      required: true
    },
    showUserInfo: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter()
    
    // Normalitzar les dades de l'usuari
    const postUser = computed(() => {
      if (!props.post.user) return null
      
      return {
        username: props.post.user.username,
        name: props.post.user.name || props.post.user.username,
        avatar: props.post.user.profileImg || props.post.user.avatar || 'https://via.placeholder.com/50'
      }
    })
    
    const handlePostClick = () => {
      // Només anar al detall si no és una resposta
      if (!props.post.postId) {
        router.push(`/post/${props.post.id}`)
      }
    }
    
    const goToProfile = () => {
      if (postUser.value) {
        router.push(`/profile/${postUser.value.username}`)
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      // Convertir a segons
      const seconds = Math.floor(diff / 1000)
      
      if (seconds < 60) {
        return 'ara mateix'
      }
      
      // Convertir a minuts
      const minutes = Math.floor(seconds / 60)
      if (minutes < 60) {
        return `${minutes}m`
      }
      
      // Convertir a hores
      const hours = Math.floor(minutes / 60)
      if (hours < 24) {
        return `${hours}h`
      }
      
      // Convertir a dies
      const days = Math.floor(hours / 24)
      if (days < 30) {
        return `${days}d`
      }
      
      // Si fa més de 30 dies, mostrar la data
      const options = { day: 'numeric', month: 'short' }
      return date.toLocaleDateString('ca-ES', options)
    }
    
    return {
      postUser,
      handlePostClick,
      goToProfile,
      formatDate
    }
  }
}
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
}

.post a {
  text-decoration: none;
  color: inherit !important;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-info__user {
  display: flex;
  flex-direction: column;
}

.user-info__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.post-detail {
  margin-bottom: 10px;
}

.post-detail p {
  margin: 0;
  font-size: 14px;
  word-wrap: break-word;
}

.post-detail time {
  font-size: 12px;
}

.interactions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.interactions .icon {
  font-size: 12px;
  color: #555;
}
</style>