import { requireAdmin, requireRole } from '../middleware/role.js';
import { missionDraft } from '../validators/missionValidator.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';
import { sendError, sendSuccess } from '../utils/responseHelper.js';

const router = Router();
router.use(requireAuth);
router.use((req, res, next) => req.user.institution_id
  ? next() : sendError(res, 'Join an institution to use campus missions.', 403));

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('campus_missions').select('id,title,brief,due_on,tasks')
    .eq('institution_id', req.user.institution_id).order('due_on').order('id');
  if (error) throw error;
  return sendSuccess(res, data);
});

router.post('/', requireAdmin, async (req, res) => {
  const draft = missionDraft(req.body);
  const { data, error } = await supabase.from('campus_missions')
    .insert({ ...draft, institution_id: req.user.institution_id }).select('id').single();
  if (error) throw error;
  return sendSuccess(res, data, 201);
});

export default router;
