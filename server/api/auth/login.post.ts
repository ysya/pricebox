import type { UserDto } from '~/types/dto/user.dto'
import { UserService } from '../../services'
import { generateJWT } from '../../utils/jwt'

export default withResponse(async (event) => {
  const body = await readBody(event)

  const { username, password } = body
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: '請提供用戶名和密碼'
    })
  }

  const userService = new UserService()
  const user = await userService.validateUser(username, password)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '用戶名或密碼錯誤'
    })
  }

  const token = generateJWT({ id: user.id })

  var response: { user: UserDto, token: string } = {
    user,
    token
  }
  return response
}) 