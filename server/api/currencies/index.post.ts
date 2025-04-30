import { defineEventHandler, readBody } from 'h3'
import { CurrencyService } from '../../services/currency.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, name, symbol } = body

    if (!code || !name) {
      return {
        statusCode: 400,
        statusMessage: '貨幣代碼和名稱為必填項'
      }
    }

    const currencyService = new CurrencyService()

    // 檢查貨幣代碼是否已存在
    const existingCurrency = await currencyService.findByCode(code)
    if (existingCurrency) {
      return {
        statusCode: 400,
        statusMessage: '該貨幣代碼已被使用'
      }
    }

    const currency = await currencyService.create({
      code,
      name,
      symbol
    })

    return currency
  } catch (error) {
    console.error('Error creating currency:', error)
    return {
      statusCode: 500,
      statusMessage: '創建貨幣時發生錯誤'
    }
  }
}) 