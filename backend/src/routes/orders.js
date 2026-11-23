import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = Router();

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

const makeOrderNumber = () =>
  'ZR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

// POST /api/orders  — prices are always recalculated server-side from the DB.
router.post('/', async (req, res) => {
  const { items, customer, shippingAddress } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  const ids = items.map((i) => i.productId).filter((id) => mongoose.isValidObjectId(id));
  const products = await Product.find({ _id: { $in: ids }, active: true });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems = [];
  for (const { productId, quantity } of items) {
    const product = byId.get(productId);
    const qty = Number.parseInt(quantity, 10);
    if (!product) return res.status(400).json({ message: 'A product in your cart is no longer available' });
    if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ message: 'Invalid quantity' });
    if (product.stock < qty) {
      return res.status(409).json({ message: `Only ${product.stock} left of ${product.name}` });
    }
    lineItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity: qty,
    });
  }

  const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const order = new Order({
    orderNumber: makeOrderNumber(),
    items: lineItems,
    customer,
    shippingAddress,
    subtotal,
    shipping,
    total: subtotal + shipping,
  });

  try {
    await order.validate();
  } catch {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  // Reserve stock atomically per line; roll back if any line fails.
  const reserved = [];
  for (const item of lineItems) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (result.modifiedCount !== 1) {
      await Promise.all(
        reserved.map((r) => Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } }))
      );
      return res.status(409).json({ message: `${item.name} just sold out` });
    }
    reserved.push(item);
  }

  await order.save();
  res.status(201).json(order);
});

// GET /api/orders/:orderNumber
router.get('/:orderNumber', async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

export default router;
