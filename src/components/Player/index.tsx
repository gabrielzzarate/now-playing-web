import React, { useState, useEffect, useCallback } from 'react'

import { useSession } from 'next-auth/react'
import useSpotify from '@hooks/useSpotify'
import useSongInfo from '@hooks/useSongInfo'
import { usePlaylistContext } from '@context/playlist'
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  VolumeUpIcon
} from '@heroicons/react/solid'

import debounce from 'lodash/debounce'

export default function Player() {
  const [volume, setVolume] = useState<number>(50)
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const { isPlaying, currentTrackId, changePlaylistState } = usePlaylistContext()

  const songInfo = useSongInfo()
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
        changePlaylistState({ currentTrackId: data.body?.item?.id })

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          changePlaylistState({ isPlaying: data.body?.is_playing })
        })
      })
    }
  }
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        changePlaylistState({ isPlaying: false })
      } else {
        spotifyApi.play()
        changePlaylistState({ isPlaying: true })
      }
    })
  }
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {})
    }, 500),
    []
  )

  console.log('songInfo', songInfo)

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      {/* Left */}
      <div className='flex items-center space-x-4'>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album?.images?.[0]?.url}
          alt=''
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className='button w-10 h-10' />
        ) : (
          <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />
        )}
        <RewindIcon onClick={() => spotifyApi.skipToPrevious()} className='button' />
      </div>

      {/* Right */}
      <div className='flex items-center space-x-3 md:space-x-4 pr-5 justify-end'>
        <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className='button' />
        <input
          className='w-14 md:w-28'
          type='range'
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon className='button' onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  )
}
