<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">產品管理</div>
      <q-btn color="primary" label="新增產品" @click="showAddDialog = true" />
    </div>

    <q-table
      :rows="products"
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
              @click="editProduct(props.row)"
            />
            <q-btn
              flat
              round
              color="info"
              icon="scale"
              @click="openUnitsDialog(props.row)"
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

    <!-- 新增/編輯產品對話框 -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editingProduct ? '編輯產品' : '新增產品' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="產品名稱"
              :rules="[(val) => !!val || '請輸入產品名稱']"
            />
            <q-input
              v-model="form.description"
              label="產品描述"
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

    <!-- 單位管理對話框 -->
    <q-dialog v-model="showUnitsDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">產品單位管理</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-gutter-md">
            <div class="text-subtitle2 q-mb-sm">已關聯的單位</div>
            <q-list bordered separator>
              <q-item v-for="unit in productUnits" :key="unit.id">
                <q-item-section>
                  <q-item-label>{{ unit.name }}</q-item-label>
                  <q-item-label caption>{{ unit.symbol }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="removeUnit(unit)"
                  />
                </q-item-section>
              </q-item>
            </q-list>

            <q-select
              v-model="selectedUnit"
              :options="availableUnits"
              label="新增單位"
              option-value="id"
              option-label="name"
              class="q-mt-md"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="add"
                  @click="addUnit"
                />
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { Product, Unit, TableColumn } from '~/types'

const $q = useQuasar()
const loading = ref(false)
const products = ref<Product[]>([])
const units = ref<Unit[]>([])
const showAddDialog = ref(false)
const showUnitsDialog = ref(false)
const editingProduct = ref<Product | null>(null)
const selectedProduct = ref<Product | null>(null)
const productUnits = ref<Unit[]>([])
const selectedUnit = ref<Unit | null>(null)

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const form = ref({
  name: '',
  description: '',
})

const columns: TableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: '產品名稱', field: 'name', align: 'left' },
  {
    name: 'description',
    label: '產品描述',
    field: 'description',
    align: 'left',
  },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
]

const availableUnits = computed(() => {
  if (!productUnits.value || !Array.isArray(productUnits.value))
    return units.value
  return units.value.filter(
    (unit) => !productUnits.value.some((pu) => pu.id === unit.id),
  )
})

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const response = await fetch(
      `/api/products?page=${page}&limit=${rowsPerPage}`,
    )
    const data = await response.json()
    products.value = data.items
    pagination.value.rowsNumber = data.total
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '獲取產品列表失敗',
    })
  } finally {
    loading.value = false
  }
}

const loadUnits = async () => {
  try {
    const response = await fetch('/api/units')
    const data = await response.json()
    units.value = data.items
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '獲取單位列表失敗',
    })
  }
}

const loadProductUnits = async (productId: number) => {
  try {
    const response = await fetch(`/api/products/${productId}/units`)
    const data = await response.json()
    productUnits.value = data
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: '獲取產品單位失敗',
    })
  }
}

const onSubmit = async () => {
  try {
    const url = editingProduct.value
      ? `/api/products/${editingProduct.value.id}`
      : '/api/products'
    const method = editingProduct.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
      throw new Error(editingProduct.value ? '更新產品失敗' : '新增產品失敗')
    }

    $q.notify({
      color: 'positive',
      message: editingProduct.value ? '更新產品成功' : '新增產品成功',
    })

    showAddDialog.value = false
    onRequest({ pagination: pagination.value })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '發生未知錯誤',
    })
  }
}

const editProduct = (product: any) => {
  editingProduct.value = product
  form.value = { ...product }
  showAddDialog.value = true
}

const openUnitsDialog = async (product: any) => {
  selectedProduct.value = product
  await loadProductUnits(product.id)
  showUnitsDialog.value = true
}

const addUnit = async () => {
  if (!selectedUnit.value || !selectedProduct.value) return

  try {
    const response = await fetch(
      `/api/products/${selectedProduct.value.id}/units`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitId: selectedUnit.value.id }),
      },
    )

    if (!response.ok) {
      throw new Error('新增產品單位失敗')
    }

    await loadProductUnits(selectedProduct.value.id)
    selectedUnit.value = null
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '發生未知錯誤',
    })
  }
}

const removeUnit = async (unit: Unit) => {
  if (!selectedProduct.value) return

  try {
    const response = await fetch(
      `/api/products/${selectedProduct.value.id}/units/${unit.id}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      throw new Error('移除產品單位失敗')
    }

    await loadProductUnits(selectedProduct.value.id)
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '發生未知錯誤',
    })
  }
}

const confirmDelete = (product: any) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除產品 ${product.name} 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('刪除產品失敗')
      }

      $q.notify({
        color: 'positive',
        message: '刪除產品成功',
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

onMounted(async () => {
  await Promise.all([onRequest({ pagination: pagination.value }), loadUnits()])
})
</script>
