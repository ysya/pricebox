import type { Product } from "~/generated/prisma"
import type { UnitDto } from "./unit.dto"


export type ProductDto = Product


export interface ProductWithUnits extends ProductDto {
  units: UnitDto[]
}

export type CreateProductDto = Pick<Product, 'name' | 'description'>

export type UpdateProductDto = Partial<ProductDto>
