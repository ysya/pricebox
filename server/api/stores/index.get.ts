import { getQuery } from 'h3'
import { StoreService } from '~/server/services/store.service'

export default withResponse(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const storeService = new StoreService()
    const stores = await storeService.findAll(page, limit)

    return stores
  } catch (error) {
    console.error('Error fetching stores:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
}) 