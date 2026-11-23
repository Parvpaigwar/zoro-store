import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { JWT_SECRET } from '../config/auth.js';

export async function requireAdmin(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not signed in' });

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Session expired — please sign in again' });
  }

  // Re-read the admin each request so deactivation / role changes apply immediately.
  const admin = await Admin.findById(payload.sub);
  if (!admin || !admin.active) return res.status(401).json({ message: 'Account disabled' });
  req.admin = admin;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.admin?.role) ? next() : res.status(403).json({ message: 'Not allowed' });
}
