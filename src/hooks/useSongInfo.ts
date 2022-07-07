import { useState, useEffect } from 'react'
import useSpotify from '@hooks/useSpotify'
import { usePlaylistContext } from '@context/playlist'

export interface SongInfo {
  name: string
  album: {
    images: Record<'url', string>[]
  }
  artists: Record<'name', string>[]
}

export default function useSongInfo() {
  const spotifyApi = useSpotify()
  const { currentTrackId, changePlaylistState } = usePlaylistContext()
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(`https://api/spotify/v1/tracks/${currentTrackId}`, {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
          }
        })
          .then((res) => res.json())
          .catch((err) => console.log(err))

        setSongInfo(trackInfo)
      }
    }

    fetchSongInfo()
  }, [currentTrackId, spotifyApi])

  return songInfo
}
