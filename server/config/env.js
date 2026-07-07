import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

export const env = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minicrm',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  isDev,
  useMemoryDb: process.env.USE_MEMORY_DB === 'true',
};

export const corsOrigins = [
  env.clientUrl,
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];
