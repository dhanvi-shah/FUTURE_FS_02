import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const DEFAULT_JWT_SECRET = 'dev_secret_change_me';

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minicrm',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  isDev,
  useMemoryDb: process.env.USE_MEMORY_DB === 'true',
};

export const corsOrigins = [
  ...env.clientUrl.split(',').map((url) => url.trim()).filter(Boolean),
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

export const validateProductionEnv = () => {
  if (isDev) {
    return;
  }

  const missing = [];

  if (!process.env.MONGODB_URI) {
    missing.push('MONGODB_URI');
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_JWT_SECRET) {
    missing.push('JWT_SECRET');
  }

  if (!process.env.CLIENT_URL) {
    missing.push('CLIENT_URL');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid production environment variables: ${missing.join(', ')}`
    );
  }
};
