import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

    const body = await readBody(event)
    const { rate } = body

    if (rate === undefined || rate <= 0) {
      return {
        statusCode: 400,
        statusMessage: '轉換率必須大於 0'
      }
    }

    const unitService = new UnitService()
    const conversion = await unitService.updateConversion(fromUnitId, toUnitId, rate)

    return conversion
  } catch (error) {
    console.error(`Error updating conversion between units ${getRouterParam(event, 'fromUnitId')} and ${getRouterParam(event, 'toUnitId')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新單位轉換時發生錯誤'
    }
  }
}) 