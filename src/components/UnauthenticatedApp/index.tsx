import * as React from 'react'
import { signIn } from 'next-auth/react'

interface UnauthenticatedAppProps {
  isSpotifyConfigured?: boolean
}

const UnauthenticatedApp = ({ isSpotifyConfigured = true }: UnauthenticatedAppProps) => {
  if (!isSpotifyConfigured) {
    return (
      <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center text-white'>
        <div className='flex flex-col items-center bg-[#18D860] text-white mb-8 rounded-full p-5 w-[350px] h-[350px]'>
          <Logo />
          <h3 className='text-black text-lg mt-3'>Now Playing</h3>
        </div>
        <div className='max-w-md text-center p-6 bg-gray-900 rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>Setup Required</h2>
          <p className='text-gray-300 mb-4'>
            Spotify credentials are not configured. To use this app:
          </p>
          <ol className='text-left text-gray-400 space-y-2 mb-4'>
            <li>1. Create an app at <a href='https://developer.spotify.com/dashboard' className='text-[#18D860] hover:underline'>Spotify Developer Dashboard</a></li>
            <li>2. Add redirect URI: <code className='bg-gray-800 px-1 rounded'>http://localhost:3000/api/auth/callback/spotify</code></li>
            <li>3. Copy <code className='bg-gray-800 px-1 rounded'>.env.example</code> to <code className='bg-gray-800 px-1 rounded'>.env.local</code></li>
            <li>4. Add your Client ID and Secret to the env file</li>
            <li>5. Restart the dev server</li>
          </ol>
          <p className='text-gray-500 text-sm'>
            See <code className='bg-gray-800 px-1 rounded'>.env.example</code> for all required environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
      <div className='flex flex-col items-center bg-[#18D860] text-white mb-8 rounded-full p-5 w-[350px] h-[350px]'>
        <Logo />
        <h3 className='text-black text-lg mt-3'>Now Playing</h3>
      </div>
      <button 
        onClick={() => signIn('spotify', { callbackUrl: '/' })} 
        className='bg-[#18D860] text-black p-5 rounded-full hover:bg-[#1ed760] transition-colors'
      >
        Login with Spotify
      </button>
    </div>
  )
}

const Logo = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 424.607 424.607" fill='#000' className='w-48 h-48'>
    <g>
      <g>
        <path d="M265.689,121.653H158.917c-2.485,0-4.5-2.015-4.5-4.5c0-31.918,25.968-57.885,57.886-57.885s57.886,25.967,57.886,57.885
          C270.189,119.639,268.174,121.653,265.689,121.653z M163.622,112.653h97.361c-2.279-24.854-23.242-44.385-48.681-44.385
          S165.902,87.8,163.622,112.653z"/>
      </g>
      <g>
        <path d="M247.694,195.233h-70.781c-2.485,0-4.5-2.015-4.5-4.5v-14.252c0-2.485,2.015-4.5,4.5-4.5h70.781
          c2.485,0,4.5,2.015,4.5,4.5v14.252C252.194,193.219,250.179,195.233,247.694,195.233z M181.413,186.233h61.781v-5.252h-61.781
          V186.233z"/>
      </g>
      <path d="M278.572,124.407H146.036c-2.485,0-4.5,2.015-4.5,4.5v35.152c0,2.485,2.015,4.5,4.5,4.5h132.536c2.485,0,4.5-2.015,4.5-4.5
        v-35.152C283.072,126.422,281.057,124.407,278.572,124.407z"/>
    </g>
  </svg>
)

export default UnauthenticatedApp