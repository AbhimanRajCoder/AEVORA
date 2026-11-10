// Route definitions for student leaderboard rankings.

import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect leaderboard endpoint with authentication
router.use(requireAuth);

router.get('/', getLeaderboard);

export default router;

