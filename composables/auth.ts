export function useAuthCookie() {
  const getAuthToken = () => {
    return useCookie('Authorization').value
  }

  const setAuthToken = (token: string | null) => {
    const tokenCookie = useCookie('Authorization', {
      maxAge: token ? 60 * 60 * 24 * 7 : 0, // 7天過期或立即過期
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    tokenCookie.value = token
  }

  const removeAuthToken = () => {
    const tokenCookie = useCookie('Authorization')
    tokenCookie.value = null
  }

  return {
    getAuthToken,
    setAuthToken,
    removeAuthToken
  }
} 