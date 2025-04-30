import prisma from './prisma'

export class CurrencyService {
  // 建立貨幣
  async create(data: {
    code: string
    name: string
    symbol?: string
  }) {
    return await prisma.currency.create({
      data
    })
  }

  // 取得所有貨幣
  async findAll() {
    return await prisma.currency.findMany({
      include: {
        purchases: true
      }
    })
  }

  // 取得單一貨幣
  async findById(id: number) {
    return await prisma.currency.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            product: true,
            store: true,
            unit: true
          }
        }
      }
    })
  }

  // 根據貨幣代碼查詢
  async findByCode(code: string) {
    return await prisma.currency.findUnique({
      where: { code }
    })
  }

  // 更新貨幣
  async update(id: number, data: {
    code?: string
    name?: string
    symbol?: string
  }) {
    return await prisma.currency.update({
      where: { id },
      data
    })
  }

  // 刪除貨幣
  async delete(id: number) {
    return await prisma.currency.delete({
      where: { id }
    })
  }
} 