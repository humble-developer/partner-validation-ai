import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

// Import pages
import Dashboard from './components/Dashboard.vue'
import LoginForm from './components/LoginForm.vue'
import NotFound from './pages/NotFound.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: LoginForm
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  // If route requires auth and user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // If user is authenticated and trying to access login, redirect to dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  }
  // Otherwise, allow navigation
  else {
    next()
  }
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#root')
