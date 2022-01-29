import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'


// todo: connect auth to mongo
//import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
//import clientPromise from "../../../lib/spotify/mongodb"

export default NextAuth({
  // jwt: {
  //   secret: 'adfadadfadfadfaerrgargba'
  // },
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private',
      clientId: process.env.SPOTIFY_ID ?? '',
      clientSecret: process.env.SPOTIFY_SECRET ?? ''
    })
  ]
})