import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);

let db: Db;

async function connectDB(): Promise<Db> {
  if (db) return db;

  try {
    await client.connect();
    db = client.db(); // This will use the database from the connection string
    console.log("Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

export default connectDB;
