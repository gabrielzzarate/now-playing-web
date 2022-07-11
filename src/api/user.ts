import { Service, useRead, SWRConfiguration } from '@api/common'
import { ListParams, User } from './types'

export class UsersService extends Service<User> {
  constructor() {
    super('/users')
  }
}

export const usersService = new UsersService()

export function useUser(id: string, params?: ListParams<User>, config?: SWRConfiguration) {
  return useRead(usersService, id, params, config)
}
