import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'

// Import de vistes
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
    component: LoginView
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

// Guard de navegació simple
router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()
  
  if (to.meta.requiresAuth && !sessionStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router