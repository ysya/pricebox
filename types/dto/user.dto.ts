import type { User } from "~/generated/prisma"

export type UserDto = Pick<User, 'id' | 'name' | 'username' | 'email' | 'role'>

export type CreateUserDto = Pick<UserDto, 'name' | 'username' | 'email' | 'role'> & { password: string }

export type UpdateUserDto = Partial<Pick<UserDto, 'name' | 'username' | 'email' | 'role'>>