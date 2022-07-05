import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import type { User, Account } from 'next-auth'
import spotifyApi, { LOGIN_URL } from '@lib/spotify'
import { Db } from 'mongodb'

// todo: connect auth to mongo
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@lib/mongo'

// info: https://next-auth.js.org/tutorials/refresh-token-rotation

async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN IS', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      //@ts-ignore
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify api
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

// console.log('MONGO', clientPromise)

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization: LOGIN_URL,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  // todo: use JWT or session lookup in DB?
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({
      token,
      account,
      user
    }: {
      token: any
      account?: Account | undefined
      user?: User | undefined
    }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at && account.expires_at * 1000 // we are handling expiry times in milliseconds
        }
      }

      // return the previous token if access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALID')
        return token
      }

      // Access token expires, refresh it
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...')
      return await refreshAccessToken(token)
    },
    async session({ session, token, ...props }: { session: any; token: any }) {
      console.log('TOKEN', props)
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    }
  }
})
