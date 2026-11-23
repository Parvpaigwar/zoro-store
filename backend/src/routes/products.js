import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products?category=Decor&featured=true
router.get('/', async (req, res) => {
  const filter = { active: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  const products = await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.json(products);
});

// GET /api/products/categories
router.get('/categories', async (_req, res) => {
  const categories = await Product.distinct('category', { active: true });
  res.json(categories.sort());
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

export default router;
