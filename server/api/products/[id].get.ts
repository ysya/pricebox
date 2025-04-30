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
    const product = await productService.findById(id)

    if (!product) {
      return {
        statusCode: 404,
        statusMessage: '找不到產品'
      }
    }

    return product
  } catch (error) {
    console.error(`Error fetching product with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '獲取產品時發生錯誤'
    }
  }
}) 