import { PrismaClient, UserRole } from '~/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export class UserService {
  async create(data: { name: string; username: string; email: string; password: string; role?: UserRole }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.USER
      }
    })
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  async findAll(page: number, pageSize: number) {
    const total = await prisma.user.count()
    const users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return {
      data: users.length > 0 ? users : [],
      pageInfo: {
        total,
        page,
        pageSize,
      },
    }
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  async findByRole(role: UserRole) {
    return await prisma.user.findFirst({
      where: { role }
    })
  }

  async update(id: number, data: { name?: string; username?: string; email?: string; password?: string; role?: UserRole }) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  async delete(id: number) {
    return await prisma.user.delete({
      where: { id }
    })
  }

  async verifyPassword(user: any, password: string) {
    return await bcrypt.compare(password, user.password)
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username)
    if (!user) return null

    const isValid = await this.verifyPassword(user, password)
    if (!isValid) return null

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    }
  }
} 