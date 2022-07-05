import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongo } from '@lib/mongo'
import Test from '@api/models/testModel'

export default async function addTest(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('CONNECTING TO MONGO')
    await connectMongo()

    console.log('CONNECTED TO MONGO')

    if (!req.body) {
      throw new Error('must have body')
    }

    console.log('CREATING DOCUMENT')
    const test = await Test.create(req.body)

    console.log('CREATED DOCUMENT')

    res.json({ test })
  } catch (error) {
    console.log(error)

    res.json({ error })
  }
}
