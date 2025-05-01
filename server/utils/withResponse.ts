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
          ...result
        }
      }

      return {
        code: 0,
        data: result
      }
    } catch (error: any) {
      throw error;
    }
  })
}
