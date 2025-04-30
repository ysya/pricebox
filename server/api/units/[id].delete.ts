import { defineEventHandler, getRouterParam } from 'h3'
import { UnitService } from '../../services/unit.service'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    if (!id) {
      return {
        statusCode: 400,
        statusMessage: '無效的單位 ID'
      }
    }

    const unitService = new UnitService()
    await unitService.delete(id)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting unit with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除單位時發生錯誤'
    }
  }
}) 