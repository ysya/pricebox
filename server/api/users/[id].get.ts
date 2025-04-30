import { UserService } from '../../services'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '請提供用戶 ID'
    })
  }

  const userService = new UserService()
  const user = await userService.findById(id)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: '用戶不存在'
    })
  }

  return user
}) 