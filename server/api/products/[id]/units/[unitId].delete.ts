import { defineEventHandler, getRouterParam } from 'h3'
import { ProductService } from '../../../../services/product.service'

export default defineEventHandler(async (event) => {
  try {
    const productId = parseInt(getRouterParam(event, 'id') || '0')
    const unitId = parseInt(getRouterParam(event, 'unitId') || '0')

    if (!productId || !unitId) {
      return {
        statusCode: 400,
        statusMessage: '無效的產品 ID 或單位 ID'
      }
    }

    const productService = new ProductService()
    await productService.removeUnit(productId, unitId)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error removing unit ${getRouterParam(event, 'unitId')} from product ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '移除產品單位時發生錯誤'
    }
  }
}) 