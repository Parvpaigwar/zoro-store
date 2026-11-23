import mongoose from 'mongoose';

let memoryServer;

export async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    // Dev fallback: spin up an in-memory MongoDB so the app runs with zero setup.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('zoro-store');
    console.log('⚠  MONGO_URI not set — using in-memory MongoDB (data resets on restart)');
  }

  await mongoose.connect(uri);
  console.log(`✓ MongoDB connected`);
  return { inMemory: Boolean(memoryServer) };
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
