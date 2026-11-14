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
  if (req.user.role !== 'student' || !data.length) return sendSuccess(res, data);
  const checks = await supabase.from('mission_checks').select('mission_id,task_index')
    .eq('student_id', req.user.id).in('mission_id', data.map(row => row.id));
  if (checks.error) throw checks.error;
  const byMission = new Map();
  for (const check of checks.data) {
    if (!byMission.has(check.mission_id)) byMission.set(check.mission_id, []);
    byMission.get(check.mission_id).push(check.task_index);
  }
  return sendSuccess(res, data.map(row => ({ ...row, checked: byMission.get(row.id) || [] })));
});

router.post('/', requireAdmin, async (req, res) => {
  const draft = missionDraft(req.body);
  const { data, error } = await supabase.from('campus_missions')
    .insert({ ...draft, institution_id: req.user.institution_id }).select('id').single();
  if (error) throw error;
  return sendSuccess(res, data, 201);
});

router.put('/:id/tasks/:index', requireRole(['student']), async (req, res) => {
  const { id, index } = req.params;
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) ||
      !/^\d+$/.test(index) || typeof req.body?.done !== 'boolean')
    return sendError(res, 'Invalid checklist update.', 400);
  const mission = await supabase.from('campus_missions').select('tasks')
    .eq('institution_id', req.user.institution_id).eq('id', id).maybeSingle();
  if (mission.error) throw mission.error;
  if (!mission.data) return sendError(res, 'Mission unavailable.', 404);
  if (Number(index) >= mission.data.tasks.length) return sendError(res, 'Unknown checklist item.', 400);
  const key = { mission_id: id, task_index: Number(index), student_id: req.user.id };
  const table = supabase.from('mission_checks');
  const result = req.body.done ? await table.upsert(key, { ignoreDuplicates: true })
    : await table.delete().match(key);
  if (result.error) throw result.error;
  return sendSuccess(res, { done: req.body.done });
});

export default router;
