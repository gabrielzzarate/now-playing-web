import useSpotify from '@hooks/spotify-api'

const reorderOptions = { range_length: 2 }

export interface useReorderPlaylistProps {
  playlistId: string
  from: number
  to: number
  options?: typeof reorderOptions
}

export default function useReorderPlaylist(playlistId: string, options = reorderOptions) {
  const spotifyApi = useSpotify()

  async function reorder(from: number, to: number) {
    if (!playlistId) return null

    try {
      const reorder = await spotifyApi.reorderTracksInPlaylist(playlistId, from, to, options)

      console.log('reorder', reorder)
    } catch (err) {
      console.error(err)
    }
  }

  return { reorder }
}
