import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

    const body = await readBody(event)
    const { name, location } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '商店名稱為必填項'
      }
    }

    const storeService = new StoreService()
    const store = await storeService.update(id, {
      name,
      location
    })

    return store
  } catch (error) {
    console.error(`Error updating store with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新商店時發生錯誤'
    }
  }
}) 