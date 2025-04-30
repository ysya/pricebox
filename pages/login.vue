<template>
  <div class="w-full h-screen flex justify-center items-center">
    <!-- 登入表單 -->
    <q-card v-if="hasAdmin" class="w-full max-w-md">
      <q-card-section>
        <div class="text-2xl text-center mb-4">登入</div>
        <q-form @submit="onSubmit" class="">
          <q-input
            v-model="username"
            label="用戶名"
            :rules="[(val) => !!val || '請輸入用戶名']"
          />
          <q-input
            v-model="password"
            label="密碼"
            type="password"
            :rules="[(val) => !!val || '請輸入密碼']"
          />
          <div class="flex justify-center">
            <q-btn
              label="登入"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- 首次設定表單 -->
    <q-card v-else class="w-full max-w-md">
      <q-card-section>
        <div class="text-2xl text-center mb-4">首次設定</div>
        <div class="text-subtitle2 text-center mb-8">
          這是系統首次使用，請建立管理員帳號
        </div>
        <q-form @submit="onFirstSetupSubmit" class="q-gutter-md">
          <q-input
            v-model="setupForm.name"
            label="姓名"
            :rules="[(val) => !!val || '請輸入姓名']"
          />
          <q-input
            v-model="setupForm.username"
            label="用戶名"
            :rules="[(val) => !!val || '請輸入用戶名']"
          />
          <q-input
            v-model="setupForm.email"
            label="電子郵件"
            type="email"
            :rules="[
              (val) => !!val || '請輸入電子郵件',
              (val) => /.+@.+\..+/.test(val) || '請輸入有效的電子郵件',
            ]"
          />
          <q-input
            v-model="setupForm.password"
            label="密碼"
            type="password"
            :rules="[
              (val) => !!val || '請輸入密碼',
              (val) => val.length >= 6 || '密碼長度至少為6個字符',
            ]"
          />
          <q-input
            v-model="setupForm.confirmPassword"
            label="確認密碼"
            type="password"
            :rules="[
              (val) => !!val || '請確認密碼',
              (val) => val === setupForm.password || '密碼不一致',
            ]"
          />
          <div class="row justify-center">
            <q-btn
              type="submit"
              color="primary"
              label="建立管理員帳號"
              :loading="setupLoading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  middleware: ['auth-redirect'],
})

const $q = useQuasar()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const route = useRoute()
const hasAdmin = ref(true) // 預設為有管理員
const setupLoading = ref(false)

// 登入
const onSubmit = async () => {
  try {
    loading.value = true
    await userStore.login(username.value, password.value)

    // 檢查是否有重定向路徑，如果有則使用它，否則導航到儀表板
    const redirectPath = route.query.redirect
      ? String(route.query.redirect)
      : '/dashboard'
    console.log('登入成功，重定向到:', redirectPath)
    navigateTo(redirectPath)
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '登入失敗，請檢查用戶名和密碼',
    })
  } finally {
    loading.value = false
  }
}

// 首次設定表單
const setupForm = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 首次設定提交
const onFirstSetupSubmit = async () => {
  setupLoading.value = true
  try {
    const response = await fetch('/api/auth/first-setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...setupForm.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || '建立管理員帳號失敗')
    }

    $q.notify({
      color: 'positive',
      message: '管理員帳號建立成功',
    })

    // 重新檢查管理員狀態，切換到登入表單
    checkAdmin()
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '建立管理員帳號失敗',
    })
  } finally {
    setupLoading.value = false
  }
}

// 檢查是否有管理員帳號
const checkAdmin = async () => {
  try {
    const response = await fetch('/api/auth/check-admin')
    const { hasAdmin: adminExists } = await response.json()
    hasAdmin.value = adminExists
    console.log('檢查管理員結果:', hasAdmin.value)
  } catch (error) {
    console.error('檢查管理員失敗:', error)
    $q.notify({
      color: 'negative',
      message: '系統檢查失敗',
    })
  }
}

onMounted(async () => {
  try {
    // 檢查是否已登入
    const isAuthenticated = await userStore.checkAuth()
    console.log('認證狀態:', isAuthenticated)

    if (isAuthenticated) {
      const redirectPath = route.query.redirect
        ? String(route.query.redirect)
        : '/dashboard'
      console.log('用戶已認證，重定向到:', redirectPath)
      navigateTo(redirectPath)
      return
    }

    // 檢查是否有管理員帳號
    await checkAdmin()
  } catch (error) {
    console.error('系統檢查失敗:', error)
    $q.notify({
      color: 'negative',
      message: '系統檢查失敗',
    })
  }
})
</script>

<style scoped></style>
