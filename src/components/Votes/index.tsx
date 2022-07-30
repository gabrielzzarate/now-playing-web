import { useMemo } from 'react'
import classNames from 'classnames'
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/solid'
import { votesService } from '@api/votes'
import type { Song } from '../../types/playlist'
import { User, Vote } from '@api/types'
import { useMatchMutate } from '@hooks/match-mutate'

interface VotesProps {
  song: Song
  playlistId: string
  user?: User
  votes?: Vote[]
}

export default function Votes({ votes, ...props }: VotesProps) {
  const matchMutate = useMatchMutate()
  const upVotes = useMemo(() => votes?.filter((vote) => vote.upvote)?.length ?? 0, [votes?.length])
  const downVotes = useMemo(
    () => votes?.filter((vote) => !vote.upvote)?.length ?? 0,
    [votes?.length]
  )

  const handleUpVote = async () => {
    try {
      const body = {
        ...formatSongInfo(),
        upvote: true
      }
      const result = await votesService.create(body)
      await matchMutate(/\/votes/)

      return result
    } catch (err) {
      console.log('upvote err', err)
    }
  }
  const handleDownVote = async () => {
    try {
      const body = {
        ...formatSongInfo(),
        upvote: false
      }
      const result = await votesService.create(body)
      await matchMutate(/\/votes/)

      return result
    } catch (err) {
      console.log('downvote err', err)
    }
  }

  const formatSongInfo = () => ({
    song: props.song.track.id,
    playlist: props.playlistId,
    user: props?.user?.id
  })

  return (
    <div className='flex items-center space-x-2'>
      <ThumbUpIcon
        className={classNames('h-4 w-4 cursor-pointer', {
          'fill-green-500': upVotes > 0 && upVotes >= downVotes
        })}
        onClick={handleUpVote}
      />
      <ThumbDownIcon
        className={classNames('h-4 w-4 cursor-pointer', {
          'text-red-500': downVotes > 0 && downVotes > upVotes
        })}
        onClick={handleDownVote}
      />
    </div>
  )
}
