<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">購買記錄</div>
      <q-btn color="primary" label="新增記錄" @click="showAddDialog = true" />
    </div>

    <q-table
      :rows="purchases"
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
              @click="editPurchase(props.row)"
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
            {{ editingPurchase ? '編輯記錄' : '新增記錄' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-select
              v-model="form.productId"
              :options="products"
              label="產品"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || '請選擇產品']"
              @update:model-value="onProductChange"
            />
            <q-select
              v-model="form.storeId"
              :options="stores"
              label="商店"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || '請選擇商店']"
            />
            <q-select
              v-model="form.currencyId"
              :options="currencies"
              label="貨幣"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || '請選擇貨幣']"
            />
            <q-select
              v-model="form.unitId"
              :options="availableUnits"
              label="單位"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || '請選擇單位']"
            />
            <q-input
              v-model.number="form.amount"
              type="number"
              label="數量"
              :rules="[(val) => val > 0 || '數量必須大於0']"
            />
            <q-input
              v-model.number="form.price"
              type="number"
              label="價格"
              :rules="[(val) => val > 0 || '價格必須大於0']"
            />
            <q-input
              v-model="form.date"
              label="購買日期"
              type="date"
              :rules="[(val) => !!val || '請選擇購買日期']"
            />
            <q-input
              v-model="form.notes"
              label="備註"
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type {
  Purchase,
  ProductWithUnits,
  Store,
  Currency,
  Unit,
  TableColumn,
} from '~/types'

const $q = useQuasar()
const loading = ref(false)
const purchases = ref<Purchase[]>([])
const products = ref<ProductWithUnits[]>([])
const stores = ref<Store[]>([])
const currencies = ref<Currency[]>([])
const units = ref<Unit[]>([])
const showAddDialog = ref(false)
const editingPurchase = ref<Purchase | null>(null)

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const form = ref<{
  productId: number | null
  storeId: number | null
  currencyId: number | null
  unitId: number | null
  amount: number
  price: number
  date: string
  notes: string
}>({
  productId: null,
  storeId: null,
  currencyId: null,
  unitId: null,
  amount: 0,
  price: 0,
  date: '',
  notes: '',
})

const columns: TableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'product', label: '產品', field: 'product', align: 'left' },
  { name: 'store', label: '商店', field: 'store', align: 'left' },
  { name: 'amount', label: '數量', field: 'amount', align: 'right' },
  { name: 'unit', label: '單位', field: 'unit', align: 'left' },
  { name: 'price', label: '價格', field: 'price', align: 'right' },
  { name: 'currency', label: '貨幣', field: 'currency', align: 'left' },
  { name: 'date', label: '日期', field: 'date', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
]

const availableUnits = computed(() => {
  if (!form.value.productId) return []
  const product = products.value.find((p) => p.id === form.value.productId)
  return product?.units || []
})

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const response = await fetch(
      `/api/purchases?page=${page}&limit=${rowsPerPage}`,
    )
    const data = await response.json()
    purchases.value = data.items
    pagination.value.rowsNumber = data.total
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取購買記錄失敗',
    })
  } finally {
    loading.value = false
  }
}

const loadProducts = async () => {
  try {
    const response = await fetch('/api/products')
    const data = await response.json()
    products.value = data.items
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取產品列表失敗',
    })
  }
}

const loadStores = async () => {
  try {
    const response = await fetch('/api/stores')
    const data = await response.json()
    stores.value = data.items
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取商店列表失敗',
    })
  }
}

const loadCurrencies = async () => {
  try {
    const response = await fetch('/api/currencies')
    const data = await response.json()
    currencies.value = data.items
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取貨幣列表失敗',
    })
  }
}

const onProductChange = async (productId: number) => {
  if (!productId) {
    form.value.unitId = null
    return
  }

  try {
    const response = await fetch(`/api/products/${productId}/units`)
    const data = await response.json()
    units.value = data
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '獲取產品單位失敗',
    })
  }
}

const onSubmit = async () => {
  try {
    const url = editingPurchase.value
      ? `/api/purchases/${editingPurchase.value.id}`
      : '/api/purchases'
    const method = editingPurchase.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
      throw new Error(editingPurchase.value ? '更新記錄失敗' : '新增記錄失敗')
    }

    $q.notify({
      color: 'positive',
      message: editingPurchase.value ? '更新記錄成功' : '新增記錄成功',
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

const editPurchase = (purchase: Purchase) => {
  editingPurchase.value = purchase
  form.value = {
    productId: purchase.productId,
    storeId: purchase.storeId,
    currencyId: purchase.currencyId,
    unitId: purchase.unitId,
    amount: purchase.amount,
    price: purchase.price,
    date: purchase.date,
    notes: purchase.notes || '',
  }
  showAddDialog.value = true
}

const confirmDelete = (purchase: Purchase) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除購買記錄嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const response = await fetch(`/api/purchases/${purchase.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('刪除記錄失敗')
      }

      $q.notify({
        color: 'positive',
        message: '刪除記錄成功',
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
  await Promise.all([
    onRequest({ pagination: pagination.value }),
    loadProducts(),
    loadStores(),
    loadCurrencies(),
  ])
})
</script>
