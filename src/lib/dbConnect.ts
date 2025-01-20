import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose extends globalThis.Global {
  mongoose: MongooseCache;
}

declare const global: GlobalWithMongoose;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI as string, {}).then(() => {
      return mongoose;
    }).catch((error: Error) => {
      cached.promise = null; // Reset the promise cache on error
      throw new Error(`Error connecting to database: ${error}`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    throw new Error(`Error connecting to database: ${error}`);
  }

  return cached.conn;
}

export default dbConnect;