import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

    const body = await readBody(event)
    const { code, name, symbol } = body

    if (!code || !name) {
      return {
        statusCode: 400,
        statusMessage: '貨幣代碼和名稱為必填項'
      }
    }

    const currencyService = new CurrencyService()

    // 檢查要更新的貨幣是否存在
    const existingCurrency = await currencyService.findById(id)
    if (!existingCurrency) {
      return {
        statusCode: 404,
        statusMessage: '找不到要更新的貨幣'
      }
    }

    // 如果更改了代碼，檢查新代碼是否已被其他貨幣使用
    if (code !== existingCurrency.code) {
      const currencyWithCode = await currencyService.findByCode(code)
      if (currencyWithCode && currencyWithCode.id !== id) {
        return {
          statusCode: 400,
          statusMessage: '該貨幣代碼已被使用'
        }
      }
    }

    const currency = await currencyService.update(id, {
      code,
      name,
      symbol
    })

    return currency
  } catch (error) {
    console.error(`Error updating currency with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新貨幣時發生錯誤'
    }
  }
}) 