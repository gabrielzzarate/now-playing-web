import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import mongoose from 'mongoose'

// for reference: https://stackoverflow.com/questions/65779464/cache-mongodb-connection-with-next-js-10-typescript-project-api-route
// for reference: https://blog.usman-s.me/how-to-use-mongoose-with-nextjs-for-mongodb

const MONGODB_URI = process.env.MONGODB_URI ?? ''
const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? ''
const options = {}

const connectMongo = async () => mongoose.connect(MONGODB_URI)

export { connectMongo }

declare global {
  namespace NodeJS {
    interface Global {
      mongo: {
        conn?: MongoClient | null
        promise?: Promise<MongoClient> | null
      }
      _mongoClientPromise: Promise<MongoClient> | null
    }
  }
}

let cached = global.mongo
let client
let clientPromise: Promise<MongoClient>

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
}

const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
  if (cached.conn) {
    // @ts-expect-error
    return cached.conn
  }

  if (!cached.promise) {
    const options: MongoClientOptions = {}

    // @ts-expect-error
    cached.promise = MongoClient.connect(MONGODB_URI, options).then((client) => {
      return {
        client,
        db: client.db(MONGO_DB_NAME)
      }
    })
  }

  cached.conn = await cached.promise

  // @ts-expect-error
  return cached.conn
}

export async function withMongo<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const conn = await connectToDatabase()
  return await fn(conn.db)
}

export default clientPromise
