import { withMongo, isMockMode } from '@lib/mongo'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import { User } from '../../types/user'

const router = createRouter<NextApiRequest, NextApiResponse>()

router
  .get(async (req, res) => {
    if (isMockMode) {
      return res.json([])
    }
    
    const users = await withMongo(async (db: Db) => {
      const collection = db.collection<User>('users')
      return await collection.find().toArray()
    })

    return res.json(users)
  })
  .post(async (req, res) => {
    if (isMockMode) {
      return res.status(503).json({ error: 'Database not configured' })
    }
    
    await withMongo(async (db: Db) => {
      const collection = db.collection<User>('users')
      await collection.insertOne({
        id: nanoid(),
        email: req.body.email,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      })

      return res.status(204).end()
    })
  })

export default router.handler()
