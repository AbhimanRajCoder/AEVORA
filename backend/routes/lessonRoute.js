// Route definitions for lessons and completion tracking.

import { Router } from 'express';
import { completeLesson } from '../controllers/lessonController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateUuidParam } from '../validators/paramValidator.js';

const router = Router();

// Protect all lesson endpoints with authentication
router.use(requireAuth);

router.post('/:id/complete', validateUuidParam, completeLesson);

export default router;

