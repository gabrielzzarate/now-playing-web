//import SpotifyWebApi from 'spotify-web-api-node'
// todo: extending types from spotify web api node

export interface ImageObject {
  url: string
}

export interface Album {
  images: [ImageObject]
  name: string
}

export interface Artist {
  name: string
}

export interface Song {
  track: {
    id: string
    name: string
    duration_ms: number
    album: Album
    artists: [Artist]
    uri: string
  }
}

export interface Playlist {
  id: string
  name: string
  images: [{ url: string }]
  tracks: {
    items: [Song]
  }
}
