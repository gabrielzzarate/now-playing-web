import { Schema, model, models } from 'mongoose'

const votesSchema = new Schema({
  song: String,
  upvote: Boolean,
  playlist: String
  // user: models.User
})

const Votes = models.Votes || model('Votes', votesSchema)

export default Votes
