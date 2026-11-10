// Route definitions for virtual drill simulations.

import { Router } from 'express';
import { getDrills, getDrill, submitDrill } from '../controllers/drillController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateUuidParam } from '../validators/paramValidator.js';
import { validateDrillSubmission } from '../validators/drillValidator.js';

const router = Router();

// Protect all drill endpoints with authentication
router.use(requireAuth);

router.get('/', getDrills);
router.get('/:id', validateUuidParam, getDrill);
router.post('/:id/submit', validateUuidParam, validateDrillSubmission, submitDrill);

export default router;

