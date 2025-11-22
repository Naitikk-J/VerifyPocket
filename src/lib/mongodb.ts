import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = uri ? new MongoClient(uri) : null;

let db: Db | null = null;
let isConnected = false;

async function connectDB(): Promise<Db | null> {
  if (db) return db;
  if (!uri || !client) {
    console.warn("⚠️  MongoDB URI not configured. Database features will be unavailable.");
    return null;
  }

  try {
    await client.connect();
    db = client.db();
    isConnected = true;
    console.log("✓ Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.warn("⚠️  Could not connect to MongoDB. Database features will be unavailable.", error);
    return null;
  }
}

export function isDBConnected(): boolean {
  return isConnected;
}

export default connectDB;
