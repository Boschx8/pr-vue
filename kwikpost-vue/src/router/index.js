import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'


import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostFormView from '@/views/PostFormView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const sessionStore = useSessionStore()
      if (sessionStore.isLoggedIn) {
        next(`/profile/${sessionStore.user.username}`)
      } else {
        next()
      }
    }
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/post/:id',
    name: 'post-detail',
    component: PostDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/post/form/:id?',
    name: 'post-form',
    component: PostFormView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()
  

  if (to.meta.requiresAuth) {
    if (!sessionStore.isLoggedIn) {

      next({ 
        path: '/login', 
        query: { redirect: to.fullPath } 
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router