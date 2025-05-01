export default withResponse(async (event) => {
  const user = event.context.auth

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '未提供認證資訊'
    })
  }

  // 過濾掉密碼等敏感資訊
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role
  }
}) 