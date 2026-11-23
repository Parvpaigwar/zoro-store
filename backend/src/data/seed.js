import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import Product from '../models/Product.js';
import products from './products.js';

export async function seedProducts() {
  // Upsert by slug so re-running never duplicates and never wipes orders.
  for (const p of products) {
    await Product.replaceOne({ slug: p.slug }, p, { upsert: true }); // keeps _id, so carts stay valid
  }
  return products.length;
}

// Run directly: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.MONGO_URI) {
    console.error('Set MONGO_URI in backend/.env to seed a persistent database.');
    console.error('(Without it, the dev server auto-seeds its in-memory DB on start.)');
    process.exit(1);
  }
  await connectDB();
  const n = await seedProducts();
  console.log(`✓ Seeded ${n} products`);
  await disconnectDB();
}
