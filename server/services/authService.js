import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const deriveName = (email) => {
  const local = String(email || 'user').split('@')[0] || 'User';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim() || 'User';
};

const signToken = (admin) =>
  jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

export const loginAdmin = async ({ email, password } = {}) => {
  const normalizedEmail = String(email || 'guest@crm.com').trim().toLowerCase() || 'guest@crm.com';
  const admin = {
    id: `guest-${Buffer.from(normalizedEmail).toString('base64url').slice(0, 24)}`,
    email: normalizedEmail,
    name: deriveName(normalizedEmail),
  };

  // Accept any credentials — password is intentionally unused.
  void password;

  return {
    token: signToken(admin),
    admin,
  };
};
