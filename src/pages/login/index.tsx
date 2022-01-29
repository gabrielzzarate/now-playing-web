import React from 'react'
import useSWR from 'swr'

export default function Login() {
  const fetcher = (url: string) => fetch(url).then(r => r.json())

  const { data, error } = useSWR('http://localhost:3050/auth/spotify', fetcher)

  console.log('data', data, error)
  return (
    <div>
      Hello Spotify
    </div>
  )
}