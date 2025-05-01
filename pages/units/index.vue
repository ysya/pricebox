<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h4">單位管理</div>
      <q-btn
        color="primary"
        label="新增單位"
        @click="showAddUnitDialog = true"
      />
    </div>

    <q-table
      :rows="units"
      :columns="unitColumns"
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
              @click="editUnit(props.row)"
            />
            <q-btn
              flat
              round
              color="info"
              icon="swap_horiz"
              @click="openConversionDialog(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDeleteUnit(props.row)"
            />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <!-- 新增/編輯單位對話框 -->
    <q-dialog v-model="showAddUnitDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingUnit ? '編輯單位' : '新增單位' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmitUnit" class="q-gutter-md">
            <q-input
              v-model="unitForm.name"
              label="單位名稱"
              :rules="[(val) => !!val || '請輸入單位名稱']"
            />
            <q-input v-model="unitForm.symbol" label="單位符號" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="確定" color="primary" @click="onSubmitUnit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 單位轉換對話框 -->
    <q-dialog v-model="showConversionDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">單位轉換</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmitConversion" class="q-gutter-md">
            <q-select
              v-model="conversionForm.toUnitId"
              :options="availableUnits"
              label="轉換到"
              option-value="id"
              option-label="name"
              :rules="[(val) => !!val || '請選擇目標單位']"
            />
            <q-input
              v-model.number="conversionForm.rate"
              type="number"
              label="轉換率"
              :rules="[(val) => val > 0 || '轉換率必須大於0']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            flat
            label="確定"
            color="primary"
            @click="onSubmitConversion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import { useUnitApi } from '~/composables/useUnitApi'
import type { UnitDto } from '~/types/dto/unit.dto'

const $q = useQuasar()
const unitApi = useUnitApi()
const loading = ref(false)
const units = ref<UnitDto[]>([])
const showAddUnitDialog = ref(false)
const showConversionDialog = ref(false)
const editingUnit = ref<UnitDto | null>(null)
const selectedUnit = ref<UnitDto | null>(null)

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const unitForm = ref({
  name: '',
  symbol: '',
})

const conversionForm = ref({
  fromUnitId: null,
  toUnitId: null,
  rate: 1,
})

const unitColumns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: '單位名稱', field: 'name', align: 'left' },
  { name: 'symbol', label: '單位符號', field: 'symbol', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
]

const availableUnits = computed(() => {
  if (!selectedUnit.value) return []
  return units.value.filter((unit) => unit.id !== selectedUnit.value?.id)
})

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const data = await unitApi.getUnits(page, rowsPerPage)
    if (data) {
      units.value = data.data
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

const onSubmitUnit = async () => {
  try {
    if (editingUnit.value) {
      const result = await unitApi.updateUnit(
        editingUnit.value.id,
        unitForm.value,
      )
      if (result) {
        $q.notify({
          color: 'positive',
          message: '更新單位成功',
        })
        showAddUnitDialog.value = false
        onRequest({ pagination: pagination.value })
      }
    } else {
      const result = await unitApi.createUnit(unitForm.value)
      if (result) {
        $q.notify({
          color: 'positive',
          message: '新增單位成功',
        })
        showAddUnitDialog.value = false
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

const editUnit = (unit: any) => {
  editingUnit.value = unit
  unitForm.value = { ...unit }
  showAddUnitDialog.value = true
}

const openConversionDialog = (unit: any) => {
  selectedUnit.value = unit
  conversionForm.value.fromUnitId = unit.id
  conversionForm.value.toUnitId = null
  conversionForm.value.rate = 1
  showConversionDialog.value = true
}

const onSubmitConversion = async () => {
  try {
    const result = await unitApi.createUnitConversion(conversionForm.value)
    if (result) {
      $q.notify({
        color: 'positive',
        message: '新增單位轉換成功',
      })
      showConversionDialog.value = false
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : '發生未知錯誤',
    })
  }
}

const confirmDeleteUnit = (unit: UnitDto) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除單位 ${unit.name} 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await unitApi.deleteUnit(unit.id)

      $q.notify({
        color: 'positive',
        message: '刪除單位成功',
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
