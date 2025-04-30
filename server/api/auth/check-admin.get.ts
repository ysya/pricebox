import { UserService } from '../../services'
import { UserRole } from '~/generated/prisma'

export default defineEventHandler(async () => {
  const userService = new UserService()
  const admin = await userService.findByRole(UserRole.ADMIN)
  console.log('檢查管理員帳號:', { hasAdmin: !!admin, admin })
  return { hasAdmin: !!admin }
}) 