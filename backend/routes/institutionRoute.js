// Route definitions for public institution listings used during signup.

import { Router } from 'express';
import { getInstitutions } from '../controllers/authController.js';

const router = Router();

router.get('/', getInstitutions);

export default router;

