import { defineEventHandler, readBody } from 'h3'
import { ProductService } from '../../services/product.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, description } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '產品名稱為必填項'
      }
    }

    const productService = new ProductService()
    const product = await productService.create({
      name,
      description
    })

    return product
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      statusCode: 500,
      statusMessage: '創建產品時發生錯誤'
    }
  }
}) 