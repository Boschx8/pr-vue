<template>
  <article class="post" @click="handlePostClick">
    <div class="user-info" v-if="showUserInfo && postUser">
      <img 
        :src="postUser.avatar" 
        :alt="postUser.username"
        class="user-info__avatar"
        @click.stop="goToProfile"
        @error="handleImageError"
      >
      <div class="user-info__user">
        <strong @click.stop="goToProfile">{{ postUser.name }}</strong>
        <span class="has-color-light has-text-small" @click.stop="goToProfile">
          @{{ postUser.username }}
        </span>
      </div>
    </div>
    
    <div class="post-detail">
      <p>{{ postContent }}</p>
      <time class="has-color-light has-text-small">
        {{ formatDate(postDate) }}
      </time>
    </div>
    
    <div class="interactions">
      <span class="icon">❤ {{ postLikes }}</span>
      <span class="icon">💬 {{ postReplies }}</span>
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
    
    const postContent = computed(() => {
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          return parsed.content || parsed.text || parsed.message || 'Contingut no disponible'
        } catch (e) {
          return props.post 
        }
      }
      return props.post.content || props.post.text || props.post.message || 'Contingut no disponible'
    })
    
    const postDate = computed(() => {
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          return parsed.createdAt || parsed.publishDate || parsed.date
        } catch (e) {
          return new Date().toISOString()
        }
      }
      return props.post.createdAt || props.post.publishDate || props.post.date
    })
    
    const postLikes = computed(() => {
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          return parsed.nLikes || parsed.likes || 0
        } catch (e) {
          return 0
        }
      }
      return props.post.nLikes || props.post.likes || 0
    })
    
    const postReplies = computed(() => {
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          return parsed.nReplies || parsed.replies || parsed.comments || 0
        } catch (e) {
          return 0
        }
      }
      return props.post.nReplies || props.post.replies || props.post.comments || 0
    })
    
    const postUser = computed(() => {
      let userData = null
      
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          userData = {
            username: parsed.username,
            name: parsed.name || parsed.username,
            avatar: parsed.profileImg
          }
        } catch (e) {
          return null
        }
      } else {
        if (props.post.user) {
          userData = {
            username: props.post.user.username,
            name: props.post.user.name || props.post.user.username,
            avatar: props.post.user.profileImg || props.post.user.avatar
          }
        } else {
          userData = {
            username: props.post.username,
            name: props.post.name || props.post.username,
            avatar: props.post.profileImg
          }
        }
      }
      
      if (!userData || !userData.username) return null
      
      return {
        username: userData.username,
        name: userData.name,
        avatar: userData.avatar || 'https://via.placeholder.com/50'
      }
    })
    
    const handlePostClick = () => {
      let postId = null
      
      if (typeof props.post === 'string') {
        try {
          const parsed = JSON.parse(props.post)
          postId = parsed.id || parsed.postId
        } catch (e) {
          return
        }
      } else {
        postId = props.post.id || props.post.postId
      }
      
      if (postId && !props.post.postId) {
        router.push(`/post/${postId}`)
      }
    }
    
    const goToProfile = () => {
      if (postUser.value) {
        router.push(`/profile/${postUser.value.username}`)
      }
    }
    
    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/50'
    }
    
    const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}`
}
    
    return {
      postUser,
      postContent,
      postDate,
      postLikes,
      postReplies,
      handlePostClick,
      goToProfile,
      handleImageError,
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
  white-space: pre-wrap; 
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