import * as React from 'react'

import Sidebar from '@components/Sidebar'
import Center from '@components/Center'

const AuthenticatedApp = () => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>
    </div>
  )
}

export default AuthenticatedApp
