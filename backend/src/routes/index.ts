import { Router } from 'express';
import authRoutes from './auth.routes';
import bruteRoutes from './brute.routes';
import fightRoutes from './fight.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/brutes', bruteRoutes);
router.use('/fights', fightRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

