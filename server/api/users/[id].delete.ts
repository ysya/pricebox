import { UserService } from '../../services'

export default withResponse(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '請提供用戶 ID'
    })
  }

  const userService = new UserService()

  // 檢查用戶是否存在
  const existingUser = await userService.findById(id)
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: '用戶不存在'
    })
  }

  await userService.delete(id)
  return
}) 