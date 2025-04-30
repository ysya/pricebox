import { defineEventHandler, getQuery } from 'h3'
import { CurrencyService } from '../../services/currency.service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const currencyService = new CurrencyService()
    const currencies = await currencyService.findAll()

    // 確保即使沒有資料也返回空陣列
    const items = currencies || []
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: items.slice(start, end),
      total: items.length
    }
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return {
      items: [],
      total: 0
    }
  }
}) 