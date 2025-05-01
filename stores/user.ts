import { defineStore } from 'pinia'
import { useAuthCookie } from '~/composables/auth'
import { UserRole } from '~/types'
import type { UserDto } from '~/types/dto/user.dto'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserDto | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const auth = useAuthCookie()

  const authApi = useAuthApi()
  const userApi = useUserApi()

  async function login(username: string, password: string) {

    try {
      const response = await authApi.login(username, password)
      console.log('登入成功', response)

      user.value = response.user
      auth.setAuthToken(response.token)
    } catch (error) {
      throw error instanceof Error ? error : new Error('登入失敗')
    }
  }

  async function logout() {
    user.value = null
    auth.removeAuthToken()
  }

  async function checkAuth() {
    try {
      const auth = useAuthCookie()
      if (auth.getAuthToken()) {
        const response = await userApi.getMe()
        user.value = response
        return true
      }
    } catch (error) {
      auth.removeAuthToken()
      return false
    }
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