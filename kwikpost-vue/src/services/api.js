import axios from 'axios'

const API_URL = 'http://localhost:3000'

// Crear instància d'axios
const api = axios.create({
  baseURL: API_URL
})

// Interceptor per afegir automàticament el token
api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem('kwikpost-session')
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession)
      if (session.token) {
      
        config.headers.Authorization = session.token
      }
    } catch (e) {
      console.error('Error parsing session:', e)
    }
  }
  return config
})

export default {
  // Login
  login(username, password) {
    return api.post('/login', { username, password })
  },
  
  // Posts
  getPosts(limit = 10, offset = 0) {
    return api.get(`/posts?limit=${limit}&offset=${offset}`)
  },
  
  getPost(id) {
    return api.get(`/post/${id}`)
  },
  
  createPost(content) {
    return api.post('/post', { content })
  },
  
  updatePost(id, content) {
    return api.put(`/post/${id}`, { content })
  },
  
  deletePost(id) {
    return api.delete(`/post/${id}`)
  },
  
  // Users
  getUser(username) {
    return api.get(`/user/${username}`)
  },
  
  getUserPosts(username, limit = 10, offset = 0) {
    return api.get(`/user/${username}/posts?limit=${limit}&offset=${offset}`)
  }
}