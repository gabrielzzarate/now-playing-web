import * as React from 'react'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

const AuthenticatedApp = dynamic(() => import('@components/authenticated-app'))
//const UnauthenticatedApp = dynamic(() => import('@components/UnauthenticatedApp'))

function App(props: any) {
  console.log('props', props)
  return <AuthenticatedApp />
}

export default App

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      session
    }
  }
}
