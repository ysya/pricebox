import { defineEventHandler, getRouterParam } from 'h3'
import { UnitService } from '~/server/services/unit.service'

export default defineEventHandler(async (event) => {
  try {
    const fromUnitId = parseInt(getRouterParam(event, 'fromUnitId') || '0')
    const toUnitId = parseInt(getRouterParam(event, 'toUnitId') || '0')

    if (!fromUnitId || !toUnitId) {
      return {
        statusCode: 400,
        statusMessage: '無效的單位 ID'
      }
    }

    const unitService = new UnitService()
    await unitService.deleteConversion(fromUnitId, toUnitId)

    return {
      success: true
    }
  } catch (error) {
    console.error(`Error deleting conversion between units ${getRouterParam(event, 'fromUnitId')} and ${getRouterParam(event, 'toUnitId')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '刪除單位轉換時發生錯誤'
    }
  }
}) 