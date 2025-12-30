import { Router } from 'express';
import BruteController from '../controllers/brute.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/leaderboard', BruteController.getLeaderboard);
router.get('/skills', BruteController.getSkills);
router.get('/name/:name', BruteController.getByName);
router.get('/:id', optionalAuthMiddleware, BruteController.getById);

// Protected routes
router.get('/', authMiddleware, BruteController.getMyBrutes);
router.post('/', authMiddleware, BruteController.create);
router.delete('/:id', authMiddleware, BruteController.delete);
router.get('/:id/opponents', authMiddleware, BruteController.getOpponents);
router.post('/:id/level-up', authMiddleware, BruteController.levelUp);

export default router;

