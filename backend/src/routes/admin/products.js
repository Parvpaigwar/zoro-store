import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import Product from '../../models/Product.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'public', 'images', 'products');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${EXT[file.mimetype]}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, PNG or WebP images')),
});

// Only these fields can be written from the admin panel.
const FIELDS = [
  'name', 'slug', 'tagline', 'description', 'category', 'price', 'compareAtPrice',
  'images', 'highlights', 'details', 'stock', 'featured', 'active', 'sortOrder',
];
const pick = (body = {}) => {
  const out = Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));
  if (out.compareAtPrice === '' || out.compareAtPrice === 0) out.compareAtPrice = undefined;
  return out;
};

function sendSaveError(err, res) {
  if (err?.code === 11000) return res.status(409).json({ message: 'That URL slug is already used by another product' });
  if (err?.name === 'ValidationError' || err?.name === 'CastError') {
    return res.status(400).json({ message: Object.values(err.errors || {})[0]?.message || err.message });
  }
  throw err;
}

// GET /api/admin/products?q=&category=&status=active|draft|low
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status === 'active') filter.active = true;
  if (req.query.status === 'draft') filter.active = false;
  if (req.query.status === 'low') filter.stock = { $lte: 5 };
  if (req.query.q) {
    const rx = new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { slug: rx }, { category: rx }];
  }
  res.json(await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 }));
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Product.create(pick(req.body)));
  } catch (err) {
    sendSaveError(err, res);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).catch(() => null);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.set(pick(req.body));
    res.json(await product.save());
  } catch (err) {
    sendSaveError(err, res);
  }
});

// Deleting keeps past orders intact (they store their own name/price snapshot).
router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id).catch(() => null);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ ok: true });
});

// POST /api/admin/products/upload  (multipart, field "images")
router.post('/upload', (req, res) => {
  upload.array('images')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.field || err.message });
    res.status(201).json({ paths: (req.files || []).map((f) => `/images/products/${f.filename}`) });
  });
});

export default router;
