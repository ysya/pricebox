import prisma from './prisma'
import type { Product } from '~/generated/prisma'

export class ProductService {
  // 建立產品
  async create(data: {
    name: string
    description?: string
  }) {
    return await prisma.product.create({
      data
    })
  }

  // 取得所有產品
  async findAll() {
    return await prisma.product.findMany({
      include: {
        units: {
          include: {
            unit: true
          }
        }
      }
    })
  }

  // 取得單一產品
  async findById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            unit: true
          }
        },
        purchases: true
      }
    })
  }

  // 更新產品
  async update(id: number, data: {
    name?: string
    description?: string
  }) {
    return await prisma.product.update({
      where: { id },
      data
    })
  }

  // 刪除產品
  async delete(id: number) {
    return await prisma.product.delete({
      where: { id }
    })
  }

  // 為產品添加單位
  async addUnit(productId: number, unitId: number) {
    return await prisma.productUnit.create({
      data: {
        productId,
        unitId
      }
    })
  }

  // 移除產品的單位
  async removeUnit(productId: number, unitId: number) {
    return await prisma.productUnit.delete({
      where: {
        productId_unitId: {
          productId,
          unitId
        }
      }
    })
  }
} 