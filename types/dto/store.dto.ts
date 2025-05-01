import type { Store } from "~/generated/prisma"


export type StoreDto = Store

export type CreateStoreDto = Pick<Store, 'name'>

export type UpdateStoreDto = Partial<Store>