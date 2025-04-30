import type { User } from "~/types";

export const useUserApi = () => {
  const api = useApi()

  const getUsers = async (page: number, limit: number) => {
    return api.getPaged<User>(`/api/users?page=${page}&limit=${limit}`)
  }

  const createUser = async (user: User) => {
    return api.post<User>('/api/users', user)
  }

  const updateUser = async (user: User) => {
    return api.put<User>(`/api/users/${user.id}`, user)
  }

  const deleteUser = async (id: number) => {
    return api.del(`/api/users/${id}`)
  }

  const getUserById = async (id: number) => {
    return api.get<User>(`/api/users/${id}`)
  }

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById
  }
}
