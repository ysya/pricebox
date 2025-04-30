import { UserService } from '../../services'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '請提供用戶 ID'
    })
  }

  const body = await readBody(event)
  const { name, username, email, password } = body

  const userService = new UserService()

  // 檢查用戶是否存在
  const existingUser = await userService.findById(id)
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: '用戶不存在'
    })
  }

  // 如果更新用戶名，檢查是否已被使用
  if (username && username !== existingUser.username) {
    const userWithUsername = await userService.findByUsername(username)
    if (userWithUsername) {
      throw createError({
        statusCode: 400,
        message: '用戶名已被使用'
      })
    }
  }

  // 如果更新郵箱，檢查是否已被使用
  if (email && email !== existingUser.email) {
    const userWithEmail = await userService.findByEmail(email)
    if (userWithEmail) {
      throw createError({
        statusCode: 400,
        message: '郵箱已被使用'
      })
    }
  }

  return await userService.update(id, {
    name,
    username,
    email,
    password
  })
}) 