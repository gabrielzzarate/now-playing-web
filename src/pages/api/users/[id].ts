import { connectMongo } from '@lib/mongo'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
// import { User as IUser } from '../../../types/user'
import User from '@api/models/user'

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  try {
    await connectMongo()
    const result = await User.findOne({ _id: req.query.id })
    res.json({ result })
  } catch (err) {
    res.json({ err })
  }
})
