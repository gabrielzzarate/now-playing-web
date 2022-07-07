import { Schema, model, models } from 'mongoose'
import Song from '@api/models/song'

// todo: look up how to add TS typings to mongoose
const playlistSchema = new Schema({
  name: String
  // songs: [Song]
})

const Playlist = models.Playlist || model('Playlist', playlistSchema)

export default Playlist
