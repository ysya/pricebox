import { defineEventHandler, getRouterParam } from 'h3'
import { StoreService } from '../../services/store.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的商店 ID'
      }
    }

    const storeService = new StoreService()
    await storeService.delete(id)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting store with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除商店時發生錯誤'
    }
  }
}) 