import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

    const body = await readBody(event)
    const { name, description } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '產品名稱為必填項'
      }
    }

    const productService = new ProductService()
    const product = await productService.update(id, {
      name,
      description
    })

    return product
  } catch (error) {
    console.error(`Error updating product with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新產品時發生錯誤'
    }
  }
}) 