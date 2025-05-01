import { readBody } from 'h3'
import { UnitService } from '~/server/services/unit.service'

export default withResponse(async (event) => {
  try {
    const body = await readBody(event)
    const { name, symbol } = body

    if (!name) {
      return {
        statusCode: 400,
        statusMessage: '單位名稱為必填項'
      }
    }

    const unitService = new UnitService()
    const unit = await unitService.create({
      name,
      symbol
    })

    return unit
  } catch (error) {
    console.error('Error creating unit:', error)
    return {
      statusCode: 500,
      statusMessage: '創建單位時發生錯誤'
    }
  }
}) 