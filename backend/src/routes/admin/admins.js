import { Router } from 'express';
import Admin, { ROLES } from '../../models/Admin.js';
import { MIN_PASSWORD_LENGTH } from '../../config/auth.js';

// Super admin only (enforced where mounted).
const router = Router();

router.get('/', async (_req, res) => {
  res.json(await Admin.find().sort({ createdAt: 1 }));
});

router.post('/', async (req, res) => {
  const { name, email, password, role = 'admin' } = req.body ?? {};
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  if (!ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  try {
    const admin = new Admin({ name, email, role });
    await admin.setPassword(password);
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'An admin with that email already exists' });
    if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
    throw err;
  }
});

// PATCH /api/admin/admins/:id  { role?, active?, password? }
router.patch('/:id', async (req, res) => {
  const admin = await Admin.findById(req.params.id).catch(() => null);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const { role, active, password } = req.body ?? {};
  const self = admin.id === req.admin.id;
  if (self && (role !== undefined || active !== undefined)) {
    return res.status(400).json({ message: "You can't change your own role or status" });
  }
  if (role !== undefined) {
    if (!ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    admin.role = role;
  }
  if (active !== undefined) admin.active = Boolean(active);
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    await admin.setPassword(password);
  }
  await admin.save();
  res.json(admin);
});

router.delete('/:id', async (req, res) => {
  if (req.params.id === req.admin.id) return res.status(400).json({ message: "You can't delete yourself" });
  const admin = await Admin.findByIdAndDelete(req.params.id).catch(() => null);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json({ ok: true });
});

export default router;
