import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon
} from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import useSpotify from 'src/hooks/useSpotify'

import { usePlaylistContext } from '@context/playlist'
import type { Playlist } from '../../types'

function Sidebar() {
  const spotifyApi = useSpotify()
  const [playlists, setPlaylists] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])

  const { changePlaylistState } = usePlaylistContext()

  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
      <div className='space-y-4'>
        <button className='flex items-center space-x-2 hover:text-white bg-'>
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5' />
          <p>Your Library</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5 text-blue-500' />
          <p>Liked Songs</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5' />
          <p>Your episodes</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        {/* Playlists from Spotify */}
        {playlists?.map((playlist: any) => (
          <p
            key={playlist.id}
            className='cursor-pointer hover:text-white'
            onClick={() => changePlaylistState({ id: playlist.id })}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
