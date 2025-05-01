
import { H3Event, H3Error, send } from 'h3'
import type { ApiError } from '~/types/api'

export default defineNitroErrorHandler((error, event: H3Event) => {
  setResponseHeader(event, "Content-Type", "application/json");
  const isDev = process.env.NODE_ENV === 'development'

  // Nuxt/H3 預設的 sendError() 可能已送出 response，保險起見這樣處理
  if (event.node.res.writableEnded) return

  const message = isError(error) && error.statusMessage ? error.statusMessage : error.message || 'Internal Server Error'
  const data = isError(error) && 'data' in error ? error.data : null
  const businessCode = (error.data as ApiError).code || -1 // 預設錯誤代碼

  const result: Record<string, any> = {
    message,
    code: businessCode
  }

  if (data !== null) {
    result.data = data
  }

  if (isDev) {
    result.stack = error.stack
  }

  send(event, JSON.stringify(result))
})
