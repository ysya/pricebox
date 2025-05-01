<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">用戶管理</div>
      <q-btn color="primary" label="新增用戶" @click="openAddDialog" />
    </div>

    <q-table
      :rows="users"
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
              @click="editUser(props.row)"
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

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? '編輯用戶' : '新增用戶' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="姓名"
              :rules="[(val) => !!val || '請輸入姓名']"
            />
            <q-input
              v-model="form.username"
              label="用戶名"
              :rules="[(val) => !!val || '請輸入用戶名']"
            />
            <q-input
              v-model="form.email"
              label="郵箱"
              type="email"
              :rules="[(val) => !!val || '請輸入郵箱']"
            />
            <q-select
              v-model="form.role"
              :options="roleOptions"
              :option-value="(option) => option.value"
              :option-label="(option) => option.label"
              map-options
              label="角色"
              :rules="[(val) => !!val || '請選擇角色']"
            />
            <q-input
              v-if="!isEditing"
              v-model="form.password"
              label="密碼"
              type="password"
              :rules="[(val) => (isEditing ? true : !!val || '請輸入密碼')]"
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
import type { UpdateUserDto, UserDto } from '~/types/dto/user.dto'
import { useUserApi } from '~/composables/useUserApi'
import { UserRole } from '~/types'

const $q = useQuasar()
const loading = ref(false)
const users = ref<UserDto[]>([])
const showDialog = ref(false)
const isEditing = ref(false)
const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const form = ref<UpdateUserDto & { id?: number; password?: string }>({
  name: '',
  username: '',
  email: '',
  role: UserRole.USER,
  password: '',
})

const roleOptions = [
  { label: '管理員', value: UserRole.ADMIN },
  { label: '一般用戶', value: UserRole.USER },
]

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: '姓名', field: 'name', align: 'left' },
  { name: 'username', label: '用戶名', field: 'username', align: 'left' },
  { name: 'email', label: '郵箱', field: 'email', align: 'left' },
  { name: 'role', label: '角色', field: 'role', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
]

const userApi = useUserApi()

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const response = await userApi.getUsers(page, rowsPerPage)
    users.value = response.data || []
    pagination.value.rowsNumber = response.pageInfo.total || 0
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取用戶列表失敗',
    })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    username: '',
    email: '',
    role: UserRole.USER,
    password: '',
  }
}

const openAddDialog = () => {
  isEditing.value = false
  resetForm()
  showDialog.value = true
}

const editUser = (user: UserDto) => {
  isEditing.value = true
  form.value = { ...user }
  showDialog.value = true
}

const onSubmit = async () => {
  try {
    if (isEditing.value && form.value.id) {
      // 編輯模式
      await userApi.updateUser(form.value.id, {
        name: form.value.name,
        username: form.value.username,
        email: form.value.email,
        role: form.value.role,
      })

      $q.notify({
        color: 'positive',
        message: '更新用戶成功',
      })
    } else {
      // 新增模式
      await userApi.createUser({
        name: form.value.name || '',
        username: form.value.username || '',
        email: form.value.email || '',
        role: form.value.role as UserRole,
        password: form.value.password || '',
      })

      $q.notify({
        color: 'positive',
        message: '新增用戶成功',
      })
    }

    showDialog.value = false
    onRequest({ pagination: pagination.value })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message:
        error instanceof Error
          ? error.message
          : isEditing.value
          ? '更新用戶失敗'
          : '新增用戶失敗',
    })
  }
}

const confirmDelete = (user: UserDto) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除用戶 ${user.name} 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await userApi.deleteUser(user.id)

      $q.notify({
        color: 'positive',
        message: '刪除用戶成功',
      })

      onRequest({ pagination: pagination.value })
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: error instanceof Error ? error.message : '刪除用戶失敗',
      })
    }
  })
}

onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>
