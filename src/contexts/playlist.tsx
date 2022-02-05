import React, { useState, useContext } from 'react'

const defaultValues = {
  // public playlist, music for coding / focus
  id: '4LnTQT9pZuyXG96WS9RNzU'
}

const PlaylistContext = React.createContext({
  ...defaultValues,
  changePlaylist: (id: string): any => {}
})

export function usePlaylistContext() {
  return useContext(PlaylistContext)
}

export function PlaylistProvider({ children }: { children: React.ReactElement }) {
  const [playlistState, setPlaylistState] = useState({ ...defaultValues })

  const changePlaylist = (id: string) => setPlaylistState((prevState) => ({ ...prevState, id }))

  return (
    <PlaylistContext.Provider value={{ ...playlistState, changePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  )
}
