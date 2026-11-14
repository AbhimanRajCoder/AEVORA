// Service handling business logic and Supabase queries for learning modules.

import { supabase } from '../config/supabase.js';

/**
 * Retrieves all disaster learning modules with student completion stats.
 * @param {string} userId - UUID of the authenticated student.
 * @returns {Promise<Array>} List of modules with completion counts.
 */
export const getAllModules = async (userId) => {
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, disaster_type, description, created_at')
    .order('created_at', { ascending: true });

  if (modulesError) throw modulesError;

  const { data: lessons, error: lessonsError } = await supabase.from('lessons').select('id, module_id');
  if (lessonsError) throw lessonsError;
  const { data: progress, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId);

  if (progressError) throw progressError;
  const completedSet = new Set((progress || []).map((p) => p.lesson_id));

  return (modules || []).map((module) => {
    const moduleLessons = (lessons || []).filter((l) => l.module_id === module.id);
    const completedCount = moduleLessons.filter((l) => completedSet.has(l.id)).length;
    const totalCount = moduleLessons.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      ...module,
      total_lessons: totalCount,
      completed_lessons: completedCount,
      progress_percentage: progressPercent,
      is_completed: totalCount > 0 && completedCount === totalCount,
    };
  });
};

/**
 * Retrieves a single module with its lessons and student completion flags.
 * @param {string} moduleId - UUID of the module to fetch.
 * @param {string} userId - UUID of the authenticated student.
 * @returns {Promise<object>} Module details with lesson list and progress.
 */
export const getModuleById = async (moduleId, userId) => {
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id, title, disaster_type, description, created_at')
    .eq('id', moduleId)
    .single();

  if (moduleError && moduleError.code !== 'PGRST116') throw moduleError;
  if (!moduleData) {
    const notFoundError = new Error('Learning module not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, content, image_url, created_at')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });

  if (lessonsError) throw lessonsError;

  const lessonIds = (lessons || []).map((l) => l.id);
  const { data: progress, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds);

  if (progressError) throw progressError;
  const completedSet = new Set((progress || []).map((p) => p.lesson_id));
  const lessonsWithStatus = (lessons || []).map((lesson) => ({
    ...lesson,
    is_completed: completedSet.has(lesson.id),
  }));

  const totalLessons = lessonsWithStatus.length;
  const completedLessons = lessonsWithStatus.filter((l) => l.is_completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    ...moduleData,
    lessons: lessonsWithStatus,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    progress_percentage: progressPercent,
    is_completed: totalLessons > 0 && completedLessons === totalLessons,
  };
};

