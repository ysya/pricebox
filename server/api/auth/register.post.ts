import { UserService } from '../../services'
import { generateJWT } from '../../utils/jwt'
import { UserRole } from '~/generated/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, username, email, password, role } = body
  if (!name || !username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: '請提供所有必要資訊'
    })
  }

  const userService = new UserService()

  // 檢查用戶名是否已存在
  const existingUser = await userService.findByUsername(username)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: '用戶名已被使用'
    })
  }

  // 檢查郵箱是否已存在
  const existingEmail = await userService.findByEmail(email)
  if (existingEmail) {
    throw createError({
      statusCode: 400,
      message: '郵箱已被使用'
    })
  }

  // 創建用戶
  const user = await userService.create({
    name,
    username,
    email,
    password,
    role: role as UserRole || undefined
  })

  // 生成 JWT
  const token = generateJWT({ id: user.id })

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  }
}) 