import { defineEventHandler, readBody, getRouterParam } from 'h3'
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

    const body = await readBody(event)
    const { name, symbol } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '單位名稱為必填項'
      }
    }

    const unitService = new UnitService()
    const unit = await unitService.update(id, {
      name,
      symbol
    })

    return unit
  } catch (error) {
    console.error(`Error updating unit with ID ${getRouterParam(event, 'id')}:`, error)
    return {
      statusCode: 500,
      statusMessage: '更新單位時發生錯誤'
    }
  }
}) 