// Route definitions for disaster learning modules.

import { Router } from 'express';
import { getModules, getModuleDetails } from '../controllers/moduleController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateUuidParam } from '../validators/paramValidator.js';

const router = Router();

// Protect all module endpoints with authentication
router.use(requireAuth);

router.get('/', getModules);
router.get('/:id', validateUuidParam, getModuleDetails);

export default router;

