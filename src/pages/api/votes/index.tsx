import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Votes from '@api/models/votes'

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const result = await Votes.find({}).limit(100)

    res.json({ result })
  })
  .post(async (req, res) => {
    const vote = await new Votes(req.body)
    const result = await vote.save()

    res.json({ result })
  })
