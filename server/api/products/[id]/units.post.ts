import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { ProductService } from '../../../services/product.service'

export default defineEventHandler(async (event) => {
  try {
    const productId = parseInt(getRouterParam(event, 'id') || '0')
    if (!productId) {
      return {
        statusCode: 400,
        statusMessage: '無效的產品 ID'
      }
    }

    const body = await readBody(event)
    const { unitId } = body

    if (!unitId) {
      return {
        statusCode: 400,
        statusMessage: '單位 ID 為必填項'
      }
    }

    const productService = new ProductService()
    const productUnit = await productService.addUnit(productId, unitId)

    return productUnit
  } catch (error) {
    console.error(`Error adding unit to product ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '添加產品單位時發生錯誤'
    }
  }
}) 