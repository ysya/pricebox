import { getQuery } from 'h3'
import { ProductService } from '~/server/services/product.service'

export default withResponse(async (event) => {

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10

  const productService = new ProductService()
  const products = await productService.findAll(page, limit)

  return products
}) 