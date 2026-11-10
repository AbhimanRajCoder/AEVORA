// Service handling business logic and Supabase queries for lessons and progress.

import { supabase } from '../config/supabase.js';

/**
 * Saves a completed lesson into the lesson_progress table for a student.
 * @param {string} lessonId - UUID of the completed lesson.
 * @param {string} userId - UUID of the authenticated student.
 * @returns {Promise<object>} Record confirming lesson completion.
 */
export const markLessonComplete = async (lessonId, userId) => {
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, module_id, title')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    const notFoundError = new Error('Lesson not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      { user_id: userId, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id' }
    )
    .select('id, user_id, lesson_id, created_at')
    .single();

  if (error) throw error;

  return {
    lesson_id: lesson.id,
    module_id: lesson.module_id,
    is_completed: true,
    completed_at: data?.created_at || new Date().toISOString(),
  };
};

