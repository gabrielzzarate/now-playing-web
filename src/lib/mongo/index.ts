import { Db, MongoClient, MongoClientOptions } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI ?? ''
const MONGO_DB = process.env.MONGO_DB_NAME ?? ''
const options = {}

// @ts-expect-error
let cached = global.mongo
let client
let clientPromise: Promise<MongoClient>

if (!cached) {
  // @ts-expect-error
  cached = global.mongo = { conn: null, promise: null }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-expect-error
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    // @ts-expect-error
    global._mongoClientPromise = client.connect()
  }
  // @ts-expect-error
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
}

const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options: MongoClientOptions = {}

    cached.promise = MongoClient.connect(MONGODB_URI, options).then((client) => {
      return {
        client,
        db: client.db(MONGO_DB)
      }
    })
  }

  cached.conn = await cached.promise

  return cached.conn
}

export async function withMongo<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const conn = await connectToDatabase()
  return await fn(conn.db)
}

export default clientPromise
