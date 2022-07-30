import React from 'react'
import Song from '@components/song'
import useReorderPlaylist from '@hooks/reorder-playlist'
import { User } from '@api/types'
import { useVotes } from '@api/votes'

import type { SpotifyPlaylist } from '../../types/playlist'

export default function Songs({
  playlist,
  user
}: {
  playlist: SpotifyPlaylist | null
  user?: User
}) {
  const { reorder } = useReorderPlaylist(playlist?.id ?? '')
  const { data: votes } = useVotes()

  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      {/* <button onClick={() => reorder(0, 5)}>Reorder</button> */}
      {playlist?.tracks?.items.map((track, i) => {
        const votesBySong = votes?.filter((vote) => vote.song === track.track.id)
        return <Song key={track.track.id} track={track} order={i} user={user} votes={votesBySong} />
      })}
    </div>
  )
}
