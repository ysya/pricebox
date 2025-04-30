import prisma from './prisma'

export class UnitService {
  // 建立單位
  async create(data: {
    name: string
    symbol?: string
  }) {
    return await prisma.unit.create({
      data
    })
  }

  // 取得所有單位
  async findAll(page: number, pageSize: number) {
    const total = await prisma.unit.count()
    const units = await prisma.unit.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    return {
      data: units,
      pageInfo: {
        page,
        pageSize,
        total
      }
    }
  }

  // 取得單一單位
  async findById(id: number) {
    return await prisma.unit.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true
          }
        },
        fromConversions: {
          include: {
            toUnit: true
          }
        },
        toConversions: {
          include: {
            fromUnit: true
          }
        }
      }
    })
  }

  // 更新單位
  async update(id: number, data: {
    name?: string
    symbol?: string
  }) {
    return await prisma.unit.update({
      where: { id },
      data
    })
  }

  // 刪除單位
  async delete(id: number) {
    return await prisma.unit.delete({
      where: { id }
    })
  }

  // 建立單位轉換關係
  async createConversion(data: {
    fromUnitId: number
    toUnitId: number
    rate: number
  }) {
    return await prisma.unitConversion.create({
      data
    })
  }

  // 更新單位轉換關係
  async updateConversion(fromUnitId: number, toUnitId: number, rate: number) {
    return await prisma.unitConversion.update({
      where: {
        fromUnitId_toUnitId: {
          fromUnitId,
          toUnitId
        }
      },
      data: { rate }
    })
  }

  // 刪除單位轉換關係
  async deleteConversion(fromUnitId: number, toUnitId: number) {
    return await prisma.unitConversion.delete({
      where: {
        fromUnitId_toUnitId: {
          fromUnitId,
          toUnitId
        }
      }
    })
  }
} 