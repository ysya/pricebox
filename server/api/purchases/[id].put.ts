import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { PurchaseService } from '../../services/purchase.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的購買記錄 ID'
      }
    }

    const body = await readBody(event)
    const {
      productId,
      storeId,
      currencyId,
      unitId,
      amount,
      price,
      date,
      notes
    } = body

    if (!productId || !storeId || !currencyId || !unitId || !amount || !price || !date) {
      return {
        statusCode: 400,
        statusMessage: '產品、商店、貨幣、單位、數量、價格和日期為必填項'
      }
    }

    const purchaseService = new PurchaseService()
    const purchase = await purchaseService.update(id, {
      productId,
      storeId,
      currencyId,
      unitId,
      amount,
      price,
      date: new Date(date),
      notes
    })

    return purchase
  } catch (error) {
    console.error(`Error updating purchase with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新購買記錄時發生錯誤'
    }
  }
}) 