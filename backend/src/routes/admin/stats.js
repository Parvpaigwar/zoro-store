import { Router } from 'express';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';

const router = Router();

// GET /api/admin/stats
router.get('/', async (_req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [revenue, byStatus, last30, products, lowStock, recent] = await Promise.all([
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Product.countDocuments(),
    Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(5).select('name slug stock images'),
    Order.find().sort({ createdAt: -1 }).limit(6),
  ]);

  res.json({
    revenue: revenue[0]?.total || 0,
    orders: revenue[0]?.count || 0,
    revenue30d: last30[0]?.total || 0,
    orders30d: last30[0]?.count || 0,
    products,
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    lowStock,
    recent,
  });
});

export default router;
