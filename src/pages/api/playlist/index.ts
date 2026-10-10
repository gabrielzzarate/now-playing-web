import { withMongo, isMockMode } from '@lib/mongo'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import { SpotifyPlaylist } from '../../../types/playlist'
import { Base } from '../../../types/index'

export interface Playlist extends Base {
  playlist?: SpotifyPlaylist
  userId?: string
  name: string
}

const router = createRouter<NextApiRequest, NextApiResponse>()

router
  .get(async (req, res) => {
    if (isMockMode) {
      return res.json([])
    }
    
    const playlists = await withMongo(async (db: Db) => {
      const collection = db.collection<Playlist>('playlists')
      return await collection.find().toArray()
    })

    return res.json(playlists)
  })
  .post(async (req, res) => {
    if (isMockMode) {
      return res.status(503).json({ error: 'Database not configured' })
    }
    
    await withMongo(async (db: Db) => {
      const collection = db.collection<Playlist>('playlists')
      await collection.insertOne({
        id: nanoid(),
        name: req.body.name,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      })

      return res.status(201).json({ success: true })
    })
  })

export default router.handler()
