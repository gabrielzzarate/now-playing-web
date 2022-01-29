import * as React from 'react'
import { signOut } from 'next-auth/react'
import type { Session } from "next-auth"

export interface Props {
  session: Session
}

const AuthenticatedApp = ({ session }: Props) => {
  console.log('session', session)

  const { user } = session
  return (
    <div>
      Authenticated App

      <div>
        Signed in as {user && user.email}
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

export default AuthenticatedApp