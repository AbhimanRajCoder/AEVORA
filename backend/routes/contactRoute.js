// Route definitions for emergency contacts.

import { Router } from 'express';
import { getContacts, createContact } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import { validateContactCreation } from '../validators/contactValidator.js';

const router = Router();

// Protect all contact routes with authentication
router.use(requireAuth);

router.get('/', getContacts);
router.post('/', requireAdmin, validateContactCreation, createContact);

export default router;

