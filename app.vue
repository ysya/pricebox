<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          v-if="userStore.isAuthenticated"
        />
        <q-toolbar-title> PriceBox 管理系統 </q-toolbar-title>
        <q-space />
        <q-btn-dropdown
          flat
          :label="userStore.user?.name || '未登入'"
          v-if="userStore.isAuthenticated"
        >
          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>登出</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      v-if="userStore.isAuthenticated"
    >
      <q-list>
        <!-- <q-item-label header>導航</q-item-label> -->
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>儀表板</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/products">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>產品管理</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/units">
          <q-item-section avatar>
            <q-icon name="scale" />
          </q-item-section>
          <q-item-section>單位管理</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/stores">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>商店管理</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/purchases">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>購買記錄</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/users" v-if="userStore.isAdmin">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>用戶管理</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <NuxtPage />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const leftDrawerOpen = ref(true)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = async () => {
  await userStore.logout()
  navigateTo('/login')
}
</script>
