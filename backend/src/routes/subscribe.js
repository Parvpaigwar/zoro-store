import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Subscriber from '../models/Subscriber.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// POST /api/subscribe { email }
router.post('/', limiter, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  res.json({ message: "You're subscribed — welcome to ZORO!" });
});

export default router;
