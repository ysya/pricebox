import { useUserStore } from "~/stores/user"

export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', async (to) => {

    const auth = useAuthCookie()
    // 忽略登入頁面
    if (to.path === '/login') {
      return
    }

    const userStore = useUserStore()

    // 如果 store 中已有用戶信息，則認為已登入
    if (userStore.isAuthenticated) {
      return
    }

    // 如果是客戶端，檢查 cookie
    if (import.meta.client) {
      const token = auth.getAuthToken()
      if (!token) {
        console.log("未登入，重定向到登入頁面", to.fullPath)
        return navigateTo({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
      userStore.checkAuth()

    }
  }, { global: true })
}) 