import * as React from 'react'

import Sidebar from '@components/sidebar'
import Center from '@components/center'
import Player from '@components/player'

const AuthenticatedApp = () => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export default AuthenticatedApp
