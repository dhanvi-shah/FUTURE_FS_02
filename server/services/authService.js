import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const signToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, name: admin.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(admin);

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  };
};
