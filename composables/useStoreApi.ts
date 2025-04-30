import { useApi } from './useApi'
import type { Store } from '~/types'

export const useStoreApi = () => {
  const api = useApi()

  const getStores = async (page: number, limit: number) => {
    return api.get<{ items: Store[]; total: number }>(`/api/store?page=${page}&limit=${limit}`)
  }

  const createStore = async (data: { name: string; location: string }) => {
    return api.post<Store>('/api/store', data)
  }

  const updateStore = async (id: number, data: { name: string; location: string }) => {
    return api.put<Store>(`/api/store/${id}`, data)
  }

  const deleteStore = async (id: number) => {
    return api.del(`/api/store/${id}`)
  }

  return {
    getStores,
    createStore,
    updateStore,
    deleteStore
  }
} 