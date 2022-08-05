import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongo } from '@lib/mongo'
import nc from 'next-connect'
import Votes from '@api/models/votes'

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    try {
      await connectMongo()
      const playlist = req.query.playlist

      const result = await Votes.find({ playlist })

      res.json({ result })
    } catch (err) {
      console.log('err', err)
    }
  })
  .post(async (req, res) => {
    await connectMongo()

    const vote = await new Votes(req.body)
    const result = await vote.save()

    res.json({ result })
  })
