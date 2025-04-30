<template>
  <div></div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

// 載入時自動重定向到適當的頁面
onMounted(async () => {
  const userStore = useUserStore()
  const isAuthenticated = await userStore.checkAuth()

  if (isAuthenticated) {
    navigateTo('/dashboard')
  } else {
    // 直接導向到登入頁面，在登入頁面根據是否有管理員決定顯示什麼
    navigateTo('/login')
  }
})
</script>
