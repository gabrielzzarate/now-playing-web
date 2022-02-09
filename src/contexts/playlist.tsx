import React, { useState, useContext } from 'react'

const defaultValues = {
  // public playlist, music for coding / focus
  id: '4LnTQT9pZuyXG96WS9RNzU',
  currentTrackId: null,
  isPlaying: false
}

const PlaylistContext = React.createContext({
  ...defaultValues,
  changePlaylistState: (newState: {}): any => {}
})

export function usePlaylistContext() {
  return useContext(PlaylistContext)
}

export function PlaylistProvider({ children }: { children: React.ReactElement }) {
  const [playlistState, setPlaylistState] = useState({ ...defaultValues })
  const changePlaylistState = (newState: {}) =>
    setPlaylistState((prevState) => ({ ...prevState, ...newState }))

  return (
    <PlaylistContext.Provider value={{ ...playlistState, changePlaylistState }}>
      {children}
    </PlaylistContext.Provider>
  )
}
