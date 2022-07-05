import { withMongo } from '@lib/mongo'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { SpotifyPlaylist } from '../../../types/playlist'
import { Base } from '../../../types/index'

export interface Playlist extends Base {
  playlist: SpotifyPlaylist
  userId: string
  name: string
}

export default nc<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    
    await withMongo(async (db: Db) => {
      const collection = db.collection<Playlist>('playlists')
      await collection.insertOne({
        id: nanoid(),
        name: req.body.name,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    })
  })