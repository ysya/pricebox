import { defineEventHandler, getRouterParam } from 'h3'
import { ProductService } from '../../services/product.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的產品 ID'
      }
    }

    const productService = new ProductService()
    await productService.delete(id)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting product with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除產品時發生錯誤'
    }
  }
}) 