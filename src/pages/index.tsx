import * as React from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

const AuthenticatedApp = dynamic(() => import('@/components/AuthenticatedApp'))
const UnauthenticatedApp = dynamic(() => import('@/components/UnauthenticatedApp'))

function App() {
  const { data: session } = useSession()

  return session ? <AuthenticatedApp session={session} /> : <UnauthenticatedApp />
}

export default App;

// todo: make first request to spotify (use YT video)
// todo: setup tailwind css style login page
