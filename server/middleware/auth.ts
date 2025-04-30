import { UserService } from '../services'
import { verifyJWT } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  // 獲取請求路徑
  const path = getRequestURL(event).pathname

  // 如果不是API請求，直接跳過
  if (!path.startsWith('/api/')) {
    return
  }

  // 排除不需要認證的路由
  if (path === '/api/auth/login' ||
    path === '/api/auth/register' ||
    path === '/api/auth/check-admin' ||
    path === '/api/auth/first-setup') {
    return
  }

  // 嘗試從cookie獲取token
  const cookies = parseCookies(event)
  let token = cookies.Authorization

  // 如果cookie中沒有token，則嘗試從Authorization頭獲取
  if (!token) {
    const authHeader = getHeader(event, 'Authorization')
    if (authHeader) {
      const parts = authHeader.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1]
      }
    }
  }

  // 如果沒有token，返回401
  if (!token) {
    throw createError({
      statusCode: 401,
      message: '未提供認證資訊'
    })
  }

  try {
    const decoded = verifyJWT(token)
    const userService = new UserService()
    const user = await userService.findById(decoded.id)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '用戶不存在'
      })
    }

    // 設置用戶信息到 event.context
    event.context.auth = user
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: '無效的認證令牌'
    })
  }
}) 