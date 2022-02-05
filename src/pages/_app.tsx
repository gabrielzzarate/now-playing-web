import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { PlaylistProvider } from '../contexts/playlist'

import '@styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PlaylistProvider>
        <Component {...pageProps} />
      </PlaylistProvider>
    </SessionProvider>
  )
}
