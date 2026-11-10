// Route definitions for the administrator preparedness dashboard.

import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = Router();

// Protect dashboard endpoints for authenticated administrators only
router.use(requireAuth, requireAdmin);

router.get('/', getDashboardStats);

export default router;

