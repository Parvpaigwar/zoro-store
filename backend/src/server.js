import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { seedProducts } from './data/seed.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import subscribeRoutes from './routes/subscribe.js';
import adminRoutes from './routes/admin/index.js';
import { ensureSuperAdmin } from './config/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images'), { maxAge: '7d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }));

// Express 5 forwards rejected async handlers here.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const { inMemory } = await connectDB();
if (inMemory) {
  const n = await seedProducts();
  console.log(`✓ Seeded ${n} products into in-memory DB`);
}

await ensureSuperAdmin();

app.listen(PORT, () => console.log(`✓ API running on http://localhost:${PORT}`));
