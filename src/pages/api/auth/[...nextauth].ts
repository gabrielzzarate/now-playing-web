import NextAuth, { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL, isSpotifyConfigured } from '@lib/spotify'

import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise, { isMockMode } from '@lib/mongo'

async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN IS', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken
    }
  } catch (err) {
    console.error(err)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

const providers = isSpotifyConfigured
  ? [
      SpotifyProvider({
        authorization: LOGIN_URL,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
      })
    ]
  : []

const authOptions: NextAuthOptions = {
  providers,
  ...(isMockMode ? {} : { adapter: MongoDBAdapter(clientPromise) }),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined
        }
      }

      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        console.log('EXISTING ACCESS TOKEN IS VALID')
        return token
      }

      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...')
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.username = token.username as string
      }
      session.error = token.error as string | undefined

      return session
    }
  }
}

export default NextAuth(authOptions)
