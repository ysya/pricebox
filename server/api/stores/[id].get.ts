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
    const store = await storeService.findById(id)

    if (!store) {
      return {
        statusCode: 404,
        statusMessage: '找不到商店'
      }
    }

    return store
  } catch (error) {
    console.error(`Error fetching store with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '獲取商店時發生錯誤'
    }
  }
}) 