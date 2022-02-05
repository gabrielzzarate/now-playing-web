import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import spotifyApi from '../lib/spotify'

// todo: extend session.user type

function useSpotify() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // if refresh token fails, direct user to login...
      if (session.error === 'RefreshAccessTokenError') {
        signIn()
      }

      spotifyApi.setAccessToken(session?.user?.accessToken)
    }
  }, [session])

  return spotifyApi
}

export default useSpotify
