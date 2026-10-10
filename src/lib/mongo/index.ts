import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? ''
const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? 'now_playing'
const options = {}

const isMockMode = !MONGODB_URI

const connectMongo = async () => {
  if (isMockMode) {
    console.warn('MongoDB URI not configured - running in mock mode')
    return null
  }
  return mongoose.connect(MONGODB_URI)
}

export { connectMongo, isMockMode }

interface MongoGlobal {
  mongo?: {
    conn?: MongoClient | null
    promise?: Promise<MongoClient> | null
  }
  _mongoClientPromise?: Promise<MongoClient>
}

const globalForMongo = globalThis as unknown as MongoGlobal

let cached = globalForMongo.mongo ?? { conn: null, promise: null }
let clientPromise: Promise<MongoClient>

if (!globalForMongo.mongo) {
  globalForMongo.mongo = cached
}

if (!isMockMode) {
  if (process.env.NODE_ENV === 'development') {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(MONGODB_URI, options)
      globalForMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalForMongo._mongoClientPromise!
  } else {
    const client = new MongoClient(MONGODB_URI, options)
    clientPromise = client.connect()
  }
} else {
  clientPromise = new Promise((_, reject) => {
    reject(new Error('MongoDB not configured - running in mock mode'))
  })
}

const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
  if (isMockMode) {
    throw new Error('MongoDB not configured - running in mock mode')
  }
  
  if (cached.conn) {
    return { client: cached.conn, db: cached.conn.db(MONGO_DB_NAME) }
  }

  if (!cached.promise) {
    const options: MongoClientOptions = {}
    cached.promise = MongoClient.connect(MONGODB_URI, options)
  }

  const client = await cached.promise!
  cached.conn = client

  return { client, db: client.db(MONGO_DB_NAME) }
}

export async function withMongo<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const conn = await connectToDatabase()
  return await fn(conn.db)
}

export default clientPromise
