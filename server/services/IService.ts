export interface IService<T> {
  findAll(page: number, pageSize: number): Promise<{ data: T[]; pageInfo: { page: number; pageSize: number; total: number } }>
  findById(id: number): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  update(id: number, data: Partial<T>): Promise<T>
  delete(id: number): Promise<void>
}