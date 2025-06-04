import axios from 'axios'

const API_URL = 'http://localhost:3000'

// Crear instància d'axios
const api = axios.create({
  baseURL: API_URL
})

// Funció helper per obtenir el token
const getAuthHeader = () => {
  const storedSession = localStorage.getItem('kwikpost-session')
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession)
      if (session.token) {
        return { Authorization: `Bearer ${session.token}` }
      }
    } catch (e) {
      console.error('Error parsing session:', e)
    }
  }
  return {}
}

export default {
  // Login
  login(username, password) {
    return api.post('/login', { username, password })
  },
  
  // Posts - SENSE 's' segons els errors
  getPosts(limit = 10, offset = 0) {
    return api.get(`/post?limit=${limit}&offset=${offset}`, {
      headers: getAuthHeader()
    })
  },
  
  getPost(id) {
    return api.get(`/post/${id}`, {
      headers: getAuthHeader()
    })
  },
  
  createPost(content) {
    return api.post('/post', { content }, {
      headers: getAuthHeader()
    })
  },
  
  updatePost(id, content) {
    return api.put(`/post/${id}`, { content }, {
      headers: getAuthHeader()
    })
  },
  
  deletePost(id) {
    return api.delete(`/post/${id}`, {
      headers: getAuthHeader()
    })
  },
  
  // Users - SENSE 's'
  getUser(username) {
    return api.get(`/user/${username}`, {
      headers: getAuthHeader()
    })
  },
  
  getUserPosts(username, limit = 10, offset = 0) {
    return api.get(`/user/${username}/posts?limit=${limit}&offset=${offset}`, {
      headers: getAuthHeader()
    })
  }
}