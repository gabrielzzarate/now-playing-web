import { Base } from './base'

export interface Vote extends Base {
  playlist: string
  song: string
  upvote: boolean
  user: string
}
