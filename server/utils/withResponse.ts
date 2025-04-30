import { eventHandler, H3Event } from 'h3'

export function withResponse<T>(handler: (event: H3Event) => Promise<T>) {
  return eventHandler(async (event) => {
    try {
      const result = await handler(event)

      if (
        result &&
        typeof result === 'object' &&
        'data' in result &&
        'pageInfo' in result
      ) {
        return {
          code: 0,
          message: '成功',
          ...result
        }
      }

      return {
        code: 0,
        message: '成功',
        data: result
      }
    } catch (error: any) {
      return {
        code: error?.code ?? -1,
        message: error?.message ?? '伺服器錯誤',
        data: null
      }
    }
  })
}
