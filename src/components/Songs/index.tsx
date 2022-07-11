import React from 'react'
import Song from '@components/Song'
import useReorderPlaylist from '@hooks/useReorderPlaylist'
import { User } from '@api/types'

import type { SpotifyPlaylist } from '../../types/playlist'

export default function Songs({
  playlist,
  user
}: {
  playlist: SpotifyPlaylist | null
  user?: User
}) {
  const { reorder } = useReorderPlaylist(playlist?.id ?? '')

  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      {/* <button onClick={() => reorder(0, 5)}>Reorder</button> */}
      {playlist?.tracks?.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} user={user} />
      ))}
    </div>
  )
}
