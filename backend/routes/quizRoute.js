// Route definitions for quizzes and server-side grading.

import { Router } from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateUuidParam } from '../validators/paramValidator.js';
import { validateQuizSubmission } from '../validators/quizValidator.js';

const router = Router();

// Protect all quiz endpoints with authentication
router.use(requireAuth);

router.get('/:moduleId', validateUuidParam('moduleId'), getQuiz);
router.post('/:moduleId/submit', validateUuidParam('moduleId'), validateQuizSubmission, submitQuiz);

export default router;

