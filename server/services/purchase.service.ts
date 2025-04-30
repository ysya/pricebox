import prisma from './prisma'

export class PurchaseService {
  // 建立購買記錄
  async create(data: {
    productId: number
    storeId: number
    currencyId: number
    unitId: number
    amount: number
    price: number
    date: Date
    notes?: string
  }) {
    return await prisma.purchase.create({
      data,
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      }
    })
  }

  // 取得所有購買記錄
  async findAll() {
    return await prisma.purchase.findMany({
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  // 取得單一購買記錄
  async findById(id: number) {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      }
    })
  }

  // 更新購買記錄
  async update(id: number, data: {
    productId?: number
    storeId?: number
    currencyId?: number
    unitId?: number
    amount?: number
    price?: number
    date?: Date
    notes?: string
  }) {
    return await prisma.purchase.update({
      where: { id },
      data,
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      }
    })
  }

  // 刪除購買記錄
  async delete(id: number) {
    return await prisma.purchase.delete({
      where: { id }
    })
  }

  // 根據產品ID查詢購買記錄
  async findByProduct(productId: number) {
    return await prisma.purchase.findMany({
      where: {
        productId
      },
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  // 根據商店ID查詢購買記錄
  async findByStore(storeId: number) {
    return await prisma.purchase.findMany({
      where: {
        storeId
      },
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  // 根據日期範圍查詢購買記錄
  async findByDateRange(startDate: Date, endDate: Date) {
    return await prisma.purchase.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        product: true,
        store: true,
        currency: true,
        unit: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }
} 