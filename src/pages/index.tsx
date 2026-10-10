import * as React from 'react'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'

const AuthenticatedApp = dynamic(() => import('@components/AuthenticatedApp'))
const UnauthenticatedApp = dynamic(() => import('@components/UnauthenticatedApp'))

interface AppProps {
  isSpotifyConfigured: boolean
}

function App({ isSpotifyConfigured }: AppProps) {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className='bg-black h-screen flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return <UnauthenticatedApp isSpotifyConfigured={isSpotifyConfigured} />
  }

  return <AuthenticatedApp />
}

export default App

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const isSpotifyConfigured = !!(process.env.NEXT_PUBLIC_CLIENT_ID && process.env.NEXT_PUBLIC_CLIENT_SECRET)

  return {
    props: {
      session,
      isSpotifyConfigured
    }
  }
}
