import * as React from 'react'

import Sidebar from '@components/Sidebar'
import Center from '@components/Center'
import Player from '@components/Player'

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
