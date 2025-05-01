import { useApi } from './useApi'
import type { CreateStoreDto, StoreDto, UpdateStoreDto } from '~/types/dto/store.dto'

export const useStoreApi = () => {
  const api = useApi()

  const getStores = async (page: number, limit: number) => {
    return api.getPaged<StoreDto>(`/api/stores?page=${page}&limit=${limit}`)
  }

  const createStore = async (data: CreateStoreDto) => {
    return api.post<StoreDto>('/api/stores', data)
  }

  const updateStore = async (id: number, data: UpdateStoreDto) => {
    return api.put<StoreDto>(`/api/stores/${id}`, data)
  }

  const deleteStore = async (id: number) => {
    return api.delete(`/api/stores/${id}`)
  }

  return {
    getStores,
    createStore,
    updateStore,
    deleteStore
  }
} 