import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { shuffle } from 'lodash'
import { ChevronDownIcon, UserIcon } from '@heroicons/react/outline'

import { usePlaylistContext } from '@context/playlist'
import useSpotify from '@hooks/useSpotify'

import type { Playlist } from '../../types'

import Songs from '@components/Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500'
]

export default function Center() {
  const { data: session } = useSession()
  const [color, setColor] = useState<string | null>(null)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const spotifyApi = useSpotify()

  const { id: playlistId } = usePlaylistContext()

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        // @ts-ignore
        setPlaylist(data.body)
      })
      .catch((err) => console.log('Something went wrong!', err))
  }, [spotifyApi, playlistId])

  useEffect(() => {
    const color = shuffle(colors).pop() ?? 'from-indigo-500'
    setColor(color)
  }, [])

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8'>
        <div
          onClick={() => signOut()}
          className='flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor:pointer rounded-full p-1 pr-2'
        >
          {session?.user?.image ? (
            <img
              className='rounded-full w-10 h-10'
              src={session?.user?.image ?? ''}
              alt={session?.user?.name ?? ''}
            />
          ) : (
            <UserIcon className='ml-3' fill='#fff' />
          )}
          <h2 className='text-white'>{session?.user?.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}
      >
        <img src={playlist?.images?.[0]?.url} alt='' className='h-44 w-44 shadow-2xl' />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs playlist={playlist} />
      </div>
    </div>
  )
}
