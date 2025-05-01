<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">商店管理</div>
      <q-btn color="primary" label="新增商店" @click="showAddDialog = true" />
    </div>

    <q-table
      :rows="stores"
      :columns="columns"
      :loading="loading"
      :pagination.sync="pagination"
      @request="onRequest"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editStore(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editingStore ? '編輯商店' : '新增商店' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="商店名稱"
              :rules="[(val) => !!val || '請輸入商店名稱']"
            />
            <q-input
              v-model="form.location"
              label="商店位置"
              type="textarea"
              autogrow
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="確定" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import type { StoreDto } from '~/types/dto/store.dto'
import { useStoreApi } from '~/composables/useStoreApi'

const $q = useQuasar()
const storeApi = useStoreApi()
const loading = ref(false)
const stores = ref<StoreDto[]>([])
const showAddDialog = ref(false)
const editingStore = ref<{ id: number; name: string; location: string } | null>(
  null,
)

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const form = ref({
  name: '',
  location: '',
})

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: '商店名稱', field: 'name', align: 'left' },
  {
    name: 'location',
    label: '商店位置',
    field: 'location',
    align: 'left',
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'center',
  },
]

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const data = await storeApi.getStores(page, rowsPerPage)
    if (data) {
      stores.value = data.data
      pagination.value.rowsNumber = data.pageInfo.total
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending
    }
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    if (editingStore.value) {
      const result = await storeApi.updateStore(
        editingStore.value.id,
        form.value,
      )
      if (result) {
        $q.notify({
          color: 'positive',
          message: '更新商店成功',
        })
        showAddDialog.value = false
        onRequest({ pagination: pagination.value })
      }
    } else {
      const result = await storeApi.createStore(form.value)
      if (result) {
        $q.notify({
          color: 'positive',
          message: '新增商店成功',
        })
        showAddDialog.value = false
        onRequest({ pagination: pagination.value })
      }
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '發生未知錯誤',
    })
  }
}

const editStore = (store: any) => {
  editingStore.value = store
  form.value = { ...store }
  showAddDialog.value = true
}

const confirmDelete = (store: any) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除商店 ${store.name} 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await storeApi.deleteStore(store.id)
      $q.notify({
        color: 'positive',
        message: '刪除商店成功',
      })
      onRequest({ pagination: pagination.value })
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: error instanceof Error ? error.message : '發生未知錯誤',
      })
    }
  })
}

onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>
