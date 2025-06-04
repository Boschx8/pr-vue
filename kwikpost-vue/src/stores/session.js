import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token
  },
  
  actions: {
    setSession(userData, token) {
      this.isLoggedIn = true
      this.user = userData
      this.token = token
    },
    
    clearSession() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
    }
  }
})