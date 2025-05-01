import { getRouterParam } from 'h3'
import { UnitService } from '~/server/services/unit.service'

export default withResponse(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的單位 ID'
      }
    }

    const unitService = new UnitService()
    const unit = await unitService.findById(id)

    if (!unit) {
      return {
        statusCode: 404,
        statusMessage: '找不到單位'
      }
    }

    return unit
  } catch (error) {
    console.error(`Error fetching unit with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '獲取單位時發生錯誤'
    }
  }
}) 