import { defineEventHandler, getRouterParam } from 'h3'
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

    const purchaseService = new PurchaseService()
    await purchaseService.delete(id)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting purchase with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除購買記錄時發生錯誤'
    }
  }
}) 