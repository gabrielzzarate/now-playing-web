import { Base } from './base'

export interface User extends Base {
  name: string
  email: string
  image: string | null
  emailVerified: boolean | null
}
