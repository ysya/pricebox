<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md">儀表板</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">歡迎回來</div>
            <div class="text-subtitle2">{{ userStore.user?.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
</script>
