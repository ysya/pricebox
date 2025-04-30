import { useQuasar } from 'quasar'
import type { ApiResponse, PagedResult } from '~/types/api'


export const useApi = () => {
  const $q = useQuasar()

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : '發生未知錯誤'
    // $q.notify({ color: 'negative', message })
  }

  const handleResponse = async <T>(response: Response): Promise<T> => {
    const result: ApiResponse<T> = await response.json()
    if (result.code !== 0) {
      throw new Error(result.message || '伺服器錯誤')
    }
    return result.data
  }

  const get = async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(url, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('連線失敗')
      return await handleResponse<T>(response)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  const getPaged = async <T>(url: string): Promise<PagedResult<T>> => {
    try {
      const response = await fetch(url, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('連線失敗')

      const result: ApiResponse<T[]> = await response.json()
      if (result.code !== 0) throw new Error(result.message)

      return {
        data: result.data,
        pageInfo: result.pageInfo!
      }
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  const post = async <T>(url: string, data: any): Promise<T> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('連線失敗')
      return await handleResponse<T>(response)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  const put = async <T>(url: string, data: any): Promise<T> => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('連線失敗')
      return await handleResponse<T>(response)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  const del = async (url: string): Promise<void> => {
    try {
      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) throw new Error('連線失敗')

      const result: ApiResponse<null> = await response.json()
      if (result.code !== 0) throw new Error(result.message || '刪除失敗')
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  return {
    get,
    getPaged,
    post,
    put,
    del
  }
}
