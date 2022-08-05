import React from 'react'
import type { Song } from '../../types/playlist'

import Votes from '@components/votes'
import useSpotify from '@hooks/spotify-api'
import { millisToMinutesAndSeconds } from '@utils/time'
import { usePlaylistContext } from '@context/playlist'
import { User, Vote } from '@api/types'

export interface SongProps {
  track: Song
  order: number
  user?: User
  votes?: Vote[]
}

export default function Song({ order, track, user, votes }: SongProps) {
  const spotifyApi = useSpotify()

  const { currentTrackId, isPlaying, changePlaylistState, id: playlistId } = usePlaylistContext()

  const handlePlaySong = () => {
    changePlaylistState({ currentTrackId: track.track.id, isPlaying: true })

    spotifyApi.play({
      uris: [track.track.uri]
    })
  }

  return (
    <div
      className='grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor:pointer'
      // onClick={handlePlaySong}
    >
      <div className='flex items-center space-x-4'>
        <p>{order + 1}</p>
        <img src={track.track.album.images[0]?.url} alt={track.track.name} className='h-10 w-10' />
        <div>
          <p className='w-36 lg:w-64 text-white truncate'>{track.track.name}</p>
          <p className='w-40 '>{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='hidden md:inline w-40'>{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
        <Votes song={track} playlistId={playlistId} user={user} votes={votes} />
      </div>
    </div>
  )
}
