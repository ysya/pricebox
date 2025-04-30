import { defineEventHandler, readBody } from 'h3'
import { UnitService } from '../../../services/unit.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { fromUnitId, toUnitId, rate } = body

    if (!fromUnitId || !toUnitId || rate === undefined) {
      return {
        statusCode: 400,
        statusMessage: '來源單位、目標單位和轉換率皆為必填項'
      }
    }

    if (fromUnitId === toUnitId) {
      return {
        statusCode: 400,
        statusMessage: '來源單位和目標單位不能相同'
      }
    }

    if (rate <= 0) {
      return {
        statusCode: 400,
        statusMessage: '轉換率必須大於 0'
      }
    }

    const unitService = new UnitService()
    const conversion = await unitService.createConversion({
      fromUnitId,
      toUnitId,
      rate
    })

    return conversion
  } catch (error) {
    console.error('Error creating unit conversion:', error)
    return {
      statusCode: 500,
      statusMessage: '創建單位轉換時發生錯誤'
    }
  }
}) 