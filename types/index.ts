import type { ProductDto } from "./dto/product.dto"
import type { StoreDto } from "./dto/store.dto"
import type { UnitDto } from "./dto/unit.dto"

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}


export interface Currency {
  id: number
  name: string
  symbol: string
}


export interface Purchase {
  id: number
  productId: number
  storeId: number
  currencyId: number
  unitId: number
  amount: number
  price: number
  date: string
  notes?: string
  product?: ProductDto
  store?: StoreDto
  currency?: Currency
  unit?: UnitDto
} 
