import { defineEventHandler, getRouterParam } from 'h3'
import { CurrencyService } from '../../services/currency.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的貨幣 ID'
      }
    }

    const currencyService = new CurrencyService()
    await currencyService.delete(id)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting currency with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除貨幣時發生錯誤'
    }
  }
}) 