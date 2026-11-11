// Route definitions for backend-proxied authentication endpoints.

import { Router } from 'express';
import {
  signup,
  login,
  refresh,
  logout,
  getMe,
  startGoogle,
  googleLaunch,
  googleCallback,
  googleComplete,
  googleStatus,
  googleIdTokenLogin,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  validateSignup,
  validateLogin,
  validateRefresh,
  validateGoogleStart,
  validateGoogleComplete,
  validateGoogleIdToken,
} from '../validators/authValidator.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', validateRefresh, refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.post('/google/start', validateGoogleStart, startGoogle);
router.get('/google/launch', googleLaunch);
router.get('/google/callback', googleCallback);
router.post('/google/complete', validateGoogleComplete, googleComplete);
router.get('/google/status', googleStatus);
router.post('/google', validateGoogleIdToken, googleIdTokenLogin);

export default router;
