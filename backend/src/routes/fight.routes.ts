import { Router } from 'express';
import FightController from '../controllers/fight.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/recent', FightController.getRecent);
router.get('/:id', optionalAuthMiddleware, FightController.getById);
router.get('/brute/:bruteId', optionalAuthMiddleware, FightController.getByBruteId);

// Protected routes
router.post('/', authMiddleware, FightController.startFight);

export default router;

