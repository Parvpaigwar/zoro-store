import { Router } from 'express';
import { requireAdmin, requireRole } from '../../middleware/auth.js';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import statsRoutes from './stats.js';
import adminRoutes from './admins.js';

const router = Router();

router.use('/auth', authRoutes);
router.use(requireAdmin); // everything below needs a signed-in admin
router.use('/stats', statsRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/admins', requireRole('superadmin'), adminRoutes);

export default router;
