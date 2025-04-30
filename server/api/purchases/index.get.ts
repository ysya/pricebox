import { defineEventHandler, getQuery } from 'h3'
import { PurchaseService } from '../../services/purchase.service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const productId = query.productId ? parseInt(query.productId as string) : null
    const storeId = query.storeId ? parseInt(query.storeId as string) : null
    const startDate = query.startDate ? new Date(query.startDate as string) : null
    const endDate = query.endDate ? new Date(query.endDate as string) : null

    const purchaseService = new PurchaseService()
    let purchases = []

    // 根據不同條件查詢
    if (productId) {
      purchases = await purchaseService.findByProduct(productId)
    } else if (storeId) {
      purchases = await purchaseService.findByStore(storeId)
    } else if (startDate && endDate) {
      purchases = await purchaseService.findByDateRange(startDate, endDate)
    } else {
      purchases = await purchaseService.findAll()
    }

    // 確保即使沒有資料也返回空陣列
    const items = purchases || []
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: items.slice(start, end),
      total: items.length
    }
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return {
      items: [],
      total: 0
    }
  }
}) 