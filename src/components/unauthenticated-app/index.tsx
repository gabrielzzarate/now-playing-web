import * as React from 'react'
import { signIn } from 'next-auth/react'

const UnauthenticatedApp = () => {

  return (
    <div>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

export default UnauthenticatedApp