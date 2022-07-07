import { Schema, model, models } from 'mongoose'
import Votes from '@api/models/votes'

const songSchema = new Schema({
  title: String,
  artist: String,
  sid: String
  // votes: [Votes]
})

const Song = models.Song || model('Song', songSchema)

export default Song
