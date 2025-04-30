import { defineEventHandler, getQuery } from 'h3'
import { StoreService } from '../../services/store.service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const storeService = new StoreService()
    const stores = await storeService.findAll()

    // 確保即使沒有資料也返回空陣列
    const items = stores || []
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: items.slice(start, end),
      total: items.length
    }
  } catch (error) {
    console.error('Error fetching stores:', error)
    return {
      items: [],
      total: 0
    }
  }
}) 