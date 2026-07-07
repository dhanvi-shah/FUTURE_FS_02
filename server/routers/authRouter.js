import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginAdmin } from '../services/authService.js';

const router = Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const result = await loginAdmin(req.body);
    res.status(200).json({ success: true, data: result });
  })
);

export default router;
