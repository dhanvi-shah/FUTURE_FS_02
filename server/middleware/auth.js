import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const guestAdmin = {
  id: 'guest',
  email: 'guest@crm.com',
  name: 'Guest User',
};

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      req.admin = {
        id: decoded.id || guestAdmin.id,
        email: decoded.email || guestAdmin.email,
        name: decoded.name || guestAdmin.name,
      };
      next();
      return;
    } catch {
      // Fall through — auth is disabled, so invalid tokens still get access.
    }
  }

  req.admin = guestAdmin;
  next();
});
