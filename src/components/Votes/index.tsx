import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/solid'

import { votesService, useVotes } from '@api/votes'
import { usersService, useUser } from '@api/user'
import type { Song } from '../../types/playlist'
import { User } from '../../types/user'

interface VotesProps {
  song: Song
  playlistId: string
  user?: User
}

export default function Votes(props: VotesProps) {
  // todo: fetch votes by playlist id
  const { data: votes } = useVotes()

  const handleUpVote = async () => {
    try {
      const body = {
        song: props.song.track.id,
        playlist: props.playlistId,
        upvote: true,
        user: props?.user?.id
      }
      const result = await votesService.create(body)

      return result
    } catch (err) {
      console.log('upvote err', err)
    }
  }
  const handleDownVote = () => {}

  return (
    <div className='flex items-center space-x-2'>
      <ThumbUpIcon className='h-4 w-4' onClick={handleUpVote} />
      <ThumbDownIcon className='h-4 w-4' />
    </div>
  )
}
