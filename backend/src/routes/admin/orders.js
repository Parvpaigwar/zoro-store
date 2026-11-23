import { Router } from 'express';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';

const router = Router();

// Allowed forward moves; cancelled and delivered are final.
const TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

// GET /api/admin/orders?status=&q=&page=1&limit=20
router.get('/', async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ orderNumber: rx }, { 'customer.name': rx }, { 'customer.email': rx }, { 'customer.phone': rx }];
  }
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

router.get('/:orderNumber', async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order, nextStatuses: TRANSITIONS[order.status] });
});

// PATCH /api/admin/orders/:orderNumber  { status }
router.patch('/:orderNumber', async (req, res) => {
  const { status } = req.body ?? {};
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!TRANSITIONS[order.status]?.includes(status)) {
    return res.status(400).json({ message: `Can't move an order from ${order.status} to ${status}` });
  }

  // Conditional update so two admins can't both apply the same transition.
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, status: order.status },
    { $set: { status } },
    { new: true }
  );
  if (!updated) return res.status(409).json({ message: 'Order was changed by someone else — refresh' });

  if (status === 'cancelled') {
    await Promise.all(
      order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } }))
    );
  }
  res.json({ order: updated, nextStatuses: TRANSITIONS[updated.status] });
});

export default router;
