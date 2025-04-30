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
    const purchase = await purchaseService.findById(id)

    if (!purchase) {
      return {
        statusCode: 404,
        statusMessage: '找不到購買記錄'
      }
    }

    return purchase
  } catch (error) {
    console.error(`Error fetching purchase with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '獲取購買記錄時發生錯誤'
    }
  }
}) 