import prisma from './prisma'

export class StoreService {
  // 建立商店
  async create(data: {
    name: string
    location?: string
  }) {
    return await prisma.store.create({
      data
    })
  }

  // 取得所有商店
  async findAll() {
    return await prisma.store.findMany({
      include: {
        purchases: true
      }
    })
  }

  // 取得單一商店
  async findById(id: number) {
    return await prisma.store.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            product: true,
            currency: true,
            unit: true
          }
        }
      }
    })
  }

  // 更新商店
  async update(id: number, data: {
    name?: string
    location?: string
  }) {
    return await prisma.store.update({
      where: { id },
      data
    })
  }

  // 刪除商店
  async delete(id: number) {
    return await prisma.store.delete({
      where: { id }
    })
  }
} 