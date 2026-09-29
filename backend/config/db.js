import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (mongoURI && mongoURI !== 'mongodb://localhost:27017/clubsphere' && !mongoURI.includes('placeholder')) {
      const conn = await mongoose.connect(mongoURI);
      console.log(`[MongoDB] Connected to Remote Atlas / Database: ${conn.connection.host}`);
      return conn;
    }

    // Otherwise, start or fallback to MongoMemoryServer for instant zero-config execution
    console.log('[MongoDB] Starting isolated in-memory Mongo server for zero-setup execution...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to In-Memory Database: ${uri}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    // If external failed, try in-memory fallback
    try {
      console.log('[MongoDB] Falling back to MongoMemoryServer...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Fallback Connected: ${uri}`);
      return conn;
    } catch (fallbackError) {
      console.error(`[MongoDB] Fatal: Failed to initialize DB: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};
