import crypto from 'node:crypto';
import Admin from '../models/Admin.js';

let secret = process.env.JWT_SECRET;
if (!secret) {
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET must be set in production');
  secret = crypto.randomBytes(32).toString('hex');
  console.warn('⚠  JWT_SECRET not set — using a random secret (admin sessions end on restart)');
}
export const JWT_SECRET = secret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const MIN_PASSWORD_LENGTH = 8;

// Creates the first super admin from env vars when none exists.
export async function ensureSuperAdmin() {
  if (await Admin.exists({ role: 'superadmin' })) return;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('⚠  No super admin exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env to create one.');
    return;
  }
  const admin = new Admin({ name: ADMIN_NAME || 'Super Admin', email: ADMIN_EMAIL, role: 'superadmin' });
  await admin.setPassword(ADMIN_PASSWORD);
  await admin.save();
  console.log(`✓ Super admin created (${ADMIN_EMAIL})`);
}
