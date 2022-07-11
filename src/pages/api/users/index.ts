import { withMongo } from '@lib/mongo'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { User } from '../../../types/user'

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const users = await withMongo(async (db: Db) => {
      const collection = db.collection<User>('users')

      return await collection.find().toArray()
    })

    return res.json(users)
  })
  .post(async (req, res) => {
    // if (!isValidEmail(req.body.email)) {
    //   return res.status(400).json({ error: 'invalid-email' })
    // }

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
