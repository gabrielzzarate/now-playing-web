import { Service, useList, useRead, SWRConfiguration, useGet } from '@api/common'
import { Base, ListParams } from './types'

export interface Vote extends Base {
  playlist: string
  song: string
  upvote: boolean
  user: string
}

export class VotesService extends Service<Vote> {
  constructor() {
    super('/votes')
  }
}

export const votesService = new VotesService()

export function useVotes(params?: ListParams<Vote>, config?: SWRConfiguration) {
  return useList(votesService, params, config)
}
