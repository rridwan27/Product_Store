import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongoose ?? {
  conn: null,
  promise: null,
};
if (!globalThis._mongoose) globalThis._mongoose = cached;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  }
  cached.conn = await cached.promise;

  // Optional: remove noisy logs in prod
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB connected:", mongoose.connection.name);
  }

  return cached.conn;
}

export default dbConnect;
