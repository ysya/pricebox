import prisma from './prisma'
import type { IService } from './IService'
import type { CreateProductDto, ProductDto, UpdateProductDto } from '~/types/dto/product.dto'


export class ProductService implements IService<ProductDto> {
  // 建立產品
  async create(data: CreateProductDto) {
    return await prisma.product.create({
      data
    })
  }

  // 取得所有產品
  async findAll(page: number, pageSize: number) {
    const total = await prisma.product.count()
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        units: {
          include: {
            unit: true
          }
        }
      }
    })
    return {
      data: products,
      pageInfo: { page, pageSize, total }
    }
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
  async update(id: number, data: UpdateProductDto) {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    return await prisma.product.update({
      where: { id },
      data
    })
  }

  // 刪除產品
  async delete(id: number) {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    await prisma.product.delete({
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