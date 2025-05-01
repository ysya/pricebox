
import type { ApiResponse } from "~/types/api";
import type { UserDto } from "~/types/dto/user.dto";

export const useAuthApi = () => {
  const api = useApi()

  const login = async (username: string, password: string) => {
    return api.post<{ user: UserDto, token: string }>('/api/auth/login', { username, password })
  }

  return {
    login
  }
}
