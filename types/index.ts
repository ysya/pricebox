export interface Unit {
  id: number
  name: string
  symbol: string
}

export interface Product {
  id: number
  name: string
  description: string
}


export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
}

export interface TableColumn {
  name: string
  label: string
  field: string | ((row: any) => any)
  required?: boolean
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sort?: (a: any, b: any, rowA: any, rowB: any) => number
  format?: (val: any) => string
  style?: string
  classes?: string
  headerStyle?: string
  headerClasses?: string
}

export interface Store {
  id: number
  name: string
}

export interface Currency {
  id: number
  name: string
  symbol: string
}

export interface ProductWithUnits extends Product {
  units: Unit[]
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
  product?: Product
  store?: Store
  currency?: Currency
  unit?: Unit
} 