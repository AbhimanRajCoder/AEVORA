// Route definitions for backend-proxied authentication endpoints.

import { Router } from 'express';
import { signup, login, refresh, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateSignup, validateLogin, validateRefresh } from '../validators/authValidator.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', validateRefresh, refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;

