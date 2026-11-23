import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../../models/Admin.js';
import { JWT_EXPIRES_IN, JWT_SECRET, MIN_PASSWORD_LENGTH } from '../../config/auth.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});

// POST /api/admin/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!admin || !admin.active || !(await admin.checkPassword(password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  const token = jwt.sign({ sub: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, admin });
});

// GET /api/admin/auth/me
router.get('/me', requireAdmin, (req, res) => res.json(req.admin));

// POST /api/admin/auth/password
router.post('/password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  const admin = await Admin.findById(req.admin.id).select('+passwordHash');
  if (typeof currentPassword !== 'string' || !(await admin.checkPassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  await admin.setPassword(newPassword);
  await admin.save();
  res.json({ ok: true });
});

export default router;
