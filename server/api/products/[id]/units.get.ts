import { defineEventHandler, getRouterParam } from 'h3'
import { ProductService } from '../../../services/product.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return []
    }

    const productService = new ProductService()
    const product = await productService.findById(id)

    if (!product || !product.units) {
      return []
    }

    // 從 ProductUnit 關聯中提取單位信息
    const units = product.units.map(pu => pu.unit).filter(Boolean)

    // 確保返回空陣列而非 undefined
    return units || []
  } catch (error) {
    console.error(`Error fetching units for product ID ${getRouterParam(event, 'id')}:`, error)
    // 出錯時也返回空陣列
    return []
  }
}) 