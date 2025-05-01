
import type { CreateUserDto, UpdateUserDto, UserDto } from "~/types/dto/user.dto";

export const useUserApi = () => {
  const api = useApi()

  const getUsers = async (page: number, limit: number) => {
    return api.getPaged<UserDto>(`/api/users?page=${page}&limit=${limit}`)
  }

  const createUser = async (user: CreateUserDto) => {
    return api.post<UserDto>('/api/users', user)
  }

  const updateUser = async (id: number, user: UpdateUserDto) => {
    return api.put<UserDto>(`/api/users/${id}`, user)
  }

  const deleteUser = async (id: number) => {
    return api.delete(`/api/users/${id}`)
  }

  const getUserById = async (id: number) => {
    return api.get<UserDto>(`/api/users/${id}`)
  }

  const getMe = async () => {
    return api.get<UserDto>('/api/users/me')
  }

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getMe
  }
}
