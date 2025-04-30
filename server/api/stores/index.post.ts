import { defineEventHandler, readBody } from 'h3'
import { StoreService } from '../../services/store.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, location } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '商店名稱為必填項'
      }
    }

    const storeService = new StoreService()
    const store = await storeService.create({
      name,
      location
    })

    return store
  } catch (error) {
    console.error('Error creating store:', error)
    return {
      statusCode: 500,
      statusMessage: '創建商店時發生錯誤'
    }
  }
}) 