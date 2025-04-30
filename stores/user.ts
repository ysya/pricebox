import { defineStore } from 'pinia'
import { UserRole, type User } from '~/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const auth = useAuthCookie()

  async function login(username: string, password: string) {

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('登入失敗')
      }

      const data = await response.json()
      user.value = data.user
      auth.setAuthToken(data.token)
    } catch (error) {
      throw error instanceof Error ? error : new Error('登入失敗')
    }
  }

  async function logout() {
    user.value = null
    auth.removeAuthToken()
  }

  async function checkAuth() {
    const auth = useAuthCookie()
    if (auth.getAuthToken()) {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${auth.getAuthToken()}`
        }
      })

      if (!response.ok) {
        auth.removeAuthToken()
        return false
      }

      const data = await response.json()
      user.value = data
      return true
    }

    return false
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth
  }
})