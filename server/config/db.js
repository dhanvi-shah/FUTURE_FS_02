import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

const connectWithUri = async (uri) => {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: env.isDev ? 4000 : 10000,
  });
  return conn;
};

const startMemoryServer = async () => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri('minicrm');
};

export const connectDB = async () => {
  if (env.useMemoryDb) {
    const uri = await startMemoryServer();
    const conn = await connectWithUri(uri);
    console.log('Using in-memory MongoDB (USE_MEMORY_DB=true)');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return;
  }

  try {
    const conn = await connectWithUri(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (!env.isDev) {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }

    console.warn(`Local MongoDB unavailable (${error.message})`);
    console.warn('Starting in-memory MongoDB for development...');

    const uri = await startMemoryServer();
    const conn = await connectWithUri(uri);
    console.log(`In-memory MongoDB ready: ${conn.connection.host}`);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
