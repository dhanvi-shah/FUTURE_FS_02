import { env } from './env.js';

const normalizeOrigin = (origin) => origin.replace(/\/$/, '');

const parseOrigins = (value) =>
  value
    .split(',')
    .map((url) => normalizeOrigin(url.trim()))
    .filter(Boolean);

const buildAllowedOrigins = () => {
  const origins = new Set([
    ...parseOrigins(env.clientUrl),
    ...parseOrigins(process.env.ALLOWED_ORIGINS || ''),
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ]);

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

const isVercelOrigin = (origin) => /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin);

export const isOriginAllowed = (origin) => {
  const normalized = normalizeOrigin(origin);

  if (allowedOrigins.has(normalized)) {
    return true;
  }

  if (!env.isDev && isVercelOrigin(normalized)) {
    return true;
  }

  if (env.isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalized)) {
    return true;
  }

  return false;
};
