# Now Playing Web

A Spotify-connected playlist management web application built with Next.js.

## Features

- **Spotify OAuth Integration**: Log in with your Spotify account
- **Playlist Management**: View and browse your Spotify playlists
- **Music Player Controls**: Play, pause, skip, and control volume
- **Playlist Reordering**: Reorder tracks in playlists (requires Spotify Premium)
- **Modern UI**: Tailwind CSS styling with responsive design

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Authentication**: NextAuth.js with Spotify OAuth provider
- **Database**: MongoDB (for user sessions and custom playlists)
- **Styling**: Tailwind CSS
- **API**: Spotify Web API via `spotify-web-api-node`
- **State Management**: React Context + SWR for data fetching
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ (tested with Node.js 22)
- A Spotify Developer account
- MongoDB database (optional, can run without for basic usage)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
   - Click "Create App"
   - Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
   - Copy the Client ID and Client Secret

3. Fill in your `.env.local`:
   ```
   NEXT_PUBLIC_CLIENT_ID=your_spotify_client_id
   NEXT_PUBLIC_CLIENT_SECRET=your_spotify_client_secret
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string
   MONGO_DB_NAME=now_playing
   NEXTAUTH_URL=http://localhost:3000
   ```

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Running Without Credentials

The app can run without Spotify/MongoDB credentials configured - it will display a setup instructions page instead of crashing.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform supporting Node.js.

## Architecture

```
src/
├── components/       # React components
│   ├── AuthenticatedApp/   # Main app layout
│   ├── UnauthenticatedApp/ # Login/setup screen
│   ├── Center/       # Main content area
│   ├── Player/       # Music player controls
│   ├── Sidebar/      # Navigation sidebar
│   ├── Song/         # Song list item
│   └── Songs/        # Song list container
├── contexts/         # React context (playlist state)
├── hooks/            # Custom React hooks
│   ├── useSpotify.ts       # Spotify API hook
│   ├── useSongInfo.ts      # Current song info
│   └── useReorderPlaylist.ts
├── lib/              # Library utilities
│   ├── mongo/        # MongoDB connection
│   └── spotify/      # Spotify API setup
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   │   ├── auth/     # NextAuth endpoints
│   │   ├── playlist/ # Playlist CRUD
│   │   └── user.ts   # User management
│   ├── login/        # Login page
│   └── index.tsx     # Main app page
├── styles/           # Global styles
└── types/            # TypeScript types
```

## API Flow

1. User authenticates via Spotify OAuth
2. NextAuth handles token management and refresh
3. Access token stored in JWT session
4. `useSpotify` hook provides authenticated API client
5. Components fetch data via Spotify Web API

## Ideas for Future Development

- Music visualizer using p5.js (see original README note)
- Custom playlist creation and management
- Social features (share playlists)
- Music recommendations
- Search functionality

## License

MIT
