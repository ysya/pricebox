
import type { CreateStoreDto, StoreDto, UpdateStoreDto } from '~/types/dto/store.dto'
import type { IService } from './IService'
import prisma from './prisma'

export class StoreService implements IService<StoreDto> {
  // 建立商店
  async create(data: CreateStoreDto) {
    return await prisma.store.create({
      data
    })
  }

  // 取得所有商店
  async findAll(page: number, pageSize: number) {
    const total = await prisma.store.count()
    const stores = await prisma.store.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      // include: {
      //   purchases: true
      // }
    })
    return {
      data: stores,
      pageInfo: { page, pageSize, total }
    }
  }

  // 取得單一商店
  async findById(id: number) {
    const store = await prisma.store.findUnique({
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
    return store
  }

  // 更新商店
  async update(id: number, data: UpdateStoreDto) {
    const store = await prisma.store.findUnique({
      where: { id }
    })
    if (!store) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Store not found'
      })
    }
    return await prisma.store.update({
      where: { id },
      data
    })
  }

  // 刪除商店
  async delete(id: number) {
    await prisma.store.delete({
      where: { id }
    })
  }
} 