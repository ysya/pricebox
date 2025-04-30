import { getQuery } from 'h3'
import { UnitService } from '../../services/unit.service'

export default withResponse(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const pageSize = parseInt(query.pageSize as string) || 10

    const unitService = new UnitService()
    const units = await unitService.findAll(page, pageSize)

    return units
  } catch (error) {
    console.error('Error fetching units:', error)
    return {
      items: [],
      total: 0
    }
  }
}) 