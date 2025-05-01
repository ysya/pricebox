import type { ApiResponse, PagedResult } from '~/types/api'

const handleResponse = async <T>(response: Response): Promise<T> => {
  const result: ApiResponse<T> = await response.json()
  if (result.code !== 0) {
    throw new Error(result.message || '伺服器錯誤')
  }
  return result.data
}

const doFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  })
  if (!response.ok) {
    throw new Error('連線失敗')
  }
  return await handleResponse<T>(response)
}

export const useApi = () => {
  const get = <T>(url: string) => doFetch<T>(url)

  const getPaged = async <T>(url: string): Promise<PagedResult<T>> => {
    const response = await fetch(url, {
      credentials: 'include'
    })
    if (!response.ok) throw new Error('連線失敗')

    const result: ApiResponse<T[]> = await response.json()
    if (result.code !== 0) throw new Error(result.message || '伺服器錯誤')

    return {
      data: result.data,
      pageInfo: result.pageInfo!
    }
  }

  const post = <T>(url: string, data: any) =>
    doFetch<T>(url, { method: 'POST', body: JSON.stringify(data) })

  const put = <T>(url: string, data: any) =>
    doFetch<T>(url, { method: 'PUT', body: JSON.stringify(data) })

  const del = (url: string) =>
    doFetch<null>(url, { method: 'DELETE' })

  return { get, getPaged, post, put, delete: del }
}
