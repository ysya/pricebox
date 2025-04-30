export interface PageInfo {
  page: number
  pageSize: number
  total: number
}

export interface PagedResult<T> {
  data: T[]
  pageInfo: PageInfo
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  pageInfo?: {
    page: number
    pageSize: number
    total: number
  }
}