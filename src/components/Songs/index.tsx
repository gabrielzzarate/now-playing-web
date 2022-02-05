import React from 'react'
import Song from '@components/Song'

import type { Playlist } from '../../types/playlist'

export default function Songs({ playlist }: { playlist: Playlist | null }) {
  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      {playlist?.tracks?.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  )
}
