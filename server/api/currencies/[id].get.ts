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
    const currency = await currencyService.findById(id)

    if (!currency) {
      return {
        statusCode: 404,
        statusMessage: '找不到貨幣'
      }
    }

    return currency
  } catch (error) {
    console.error(`Error fetching currency with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '獲取貨幣時發生錯誤'
    }
  }
}) 