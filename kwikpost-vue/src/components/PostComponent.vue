<template>
  <article class="post" @click="handlePostClick">
    <div class="user-info" v-if="showUserInfo">
      <img 
        :src="post.user.avatar" 
        :alt="post.user.username"
        class="user-info__avatar"
        @click.stop="goToProfile"
      >
      <div class="user-info__user">
        <strong @click.stop="goToProfile">{{ post.user.name }}</strong>
        <span class="has-color-light has-text-small" @click.stop="goToProfile">
          @{{ post.user.username }}
        </span>
      </div>
    </div>
    
    <div class="post-detail">
      <p>{{ post.content }}</p>
      <time class="has-color-light has-text-small">
        {{ formatDate(post.createdAt) }}
      </time>
    </div>
    
    <div class="interactions">
      <span class="icon">❤ {{ post.likes }}</span>
      <span class="icon">💬 {{ post.replies }}</span>
    </div>
  </article>
</template>

<script>
import { useRouter } from 'vue-router'

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
    
    const handlePostClick = () => {
      // Només anar al detall si no és una resposta
      if (!props.post.postId) {
        router.push(`/post/${props.post.id}`)
      }
    }
    
    const goToProfile = () => {
      router.push(`/profile/${props.post.user.username}`)
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      // Convertir a hores
      const hours = Math.floor(diff / (1000 * 60 * 60))
      
      if (hours < 24) {
        return `${hours}h`
      } else {
        const days = Math.floor(hours / 24)
        return `${days}d`
      }
    }
    
    return {
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
}

.post-detail {
  margin-bottom: 10px;
}

.post-detail p {
  margin: 0;
  font-size: 14px;
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