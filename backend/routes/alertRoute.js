// Route definitions for campus emergency and drill alerts.

import { Router } from 'express';
import { getAlerts, createAlert } from '../controllers/alertController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { validateAlertCreation } from '../validators/alertValidator.js';

const router = Router();

// Protect all alert routes with authentication
router.use(requireAuth);

router.get('/', getAlerts);
router.post('/', requireAdmin, validateAlertCreation, createAlert);

export default router;

