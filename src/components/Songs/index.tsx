import React from 'react'
import Song from '@components/Song'
import useReorderPlaylist from '@hooks/useReorderPlaylist'

import type { Playlist } from '../../types/playlist'

export default function Songs({ playlist }: { playlist: Playlist | null }) {
  console.log({ playlist })

  const { reorder } = useReorderPlaylist(playlist?.id ?? '')

  // console.log('data', data)

  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      <button onClick={() => reorder(0, 5)}>Reorder</button>
      {playlist?.tracks?.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  )
}
