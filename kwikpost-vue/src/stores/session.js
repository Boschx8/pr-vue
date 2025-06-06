import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => {

    const savedSession = localStorage.getItem('kwikpost-session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        return {
          isLoggedIn: true,
          user: session.user,
          token: session.token
        }
      } catch (e) {
        console.error('Error parsing sessió del localStorage:', e)
        localStorage.removeItem('kwikpost-session')
      }
    }
    
    return {
      isLoggedIn: false,
      user: null,
      token: null
    }
  },
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token
  },
  
  actions: {
    setSession(userData, token) {
      this.isLoggedIn = true
      this.user = userData
      this.token = token
      

      localStorage.setItem('kwikpost-session', JSON.stringify({
        user: userData,
        token: token
      }))
    },
    
    clearSession() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
      
      localStorage.removeItem('kwikpost-session')
    }
  }
})