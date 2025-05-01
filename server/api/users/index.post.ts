
import { UserService } from '~/server/services'
import type { CreateUserDto } from '~/types/dto/user.dto'

export default withResponse(async (event) => {
  try {
    const body = await readBody<CreateUserDto>(event)

    // 驗證必要欄位
    if (!body.name || !body.username || !body.email || !body.role) {
      throw createError({
        statusCode: 400,
        message: '缺少必要欄位'
      })
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        message: '無效的電子郵件格式'
      })
    }

    const userService = new UserService()

    // 建立使用者
    const user = await userService.create(body)

    return {
      user
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '建立使用者失敗'
    })
  }
})
