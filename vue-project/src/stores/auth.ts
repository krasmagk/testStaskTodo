import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import cookies from 'js-cookie'

const cookieIsAuthenticated = cookies.get('isAuthenticated') || false
const cookieToken = cookies.get('token') || ''
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: cookieIsAuthenticated,
    token: cookieToken
  }),
  actions: {
    login(token: string): void {
      this.isAuthenticated = true
      this.token = token
      cookies.set('isAuthenticated', 'true', '7d')
      cookies.set('token', token, '7d')
    },
    logout() {
      this.isAuthenticated = false
      this.token = ''
      cookies.remove('isAuthenticated')
      cookies.remove('token')
    }
  }
})
