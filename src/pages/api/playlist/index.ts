import Playlist from '@api/models/playlist'
import { connectMongo } from '@lib/mongo'
// import { withMongo } from '@lib/mongo'
// import { Db } from 'mongodb'
// import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { SpotifyPlaylist } from '../../../types/playlist'
import { Base } from '../../../types/index'

export interface Playlist extends Base {
  playlist: SpotifyPlaylist
  userId: string
  name: string
}

// export default nc<NextApiRequest, NextApiResponse>()
//   .post(async (req, res) => {

//     await withMongo(async (db: Db) => {
//       const collection = db.collection<Playlist>('playlists')
//       await collection.insertOne({
//         id: nanoid(),
//         name: req.body.name,
//         created: new Date().toISOString(),
//         updated: new Date().toISOString()
//     })
//   })

export default nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  try {
    console.log('connecting')
    await connectMongo()

    const playlist = await Playlist.create(req.body)
    console.log('playlist', playlist)
    res.json({ playlist })
  } catch (error) {
    console.log('error', error)
    res.json({ error })
  }
})
