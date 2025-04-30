import { useUserStore } from "~/stores/user"

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // 如果 store 中已有用戶信息，則認為已登入
  if (userStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }

  // 如果是客戶端，檢查 cookie
  if (import.meta.client) {
    const token = useCookie('auth_token').value
    if (token) {
      return navigateTo('/dashboard')
    }
  }
}) 