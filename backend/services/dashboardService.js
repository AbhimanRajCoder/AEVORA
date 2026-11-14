// Service calculating institutional preparedness metrics and admin dashboard analytics.

import { supabase } from '../config/supabase.js';

/**
 * Calculates preparedness metrics for an institution.
 * @param {string|null} institutionId - UUID of the admin's institution.
 * @returns {Promise<object>} Dashboard metrics and calculated preparedness score.
 */
export const getAdminDashboardStats = async (institutionId) => {
  if (!institutionId) {
    const error = new Error('Admin must belong to an institution to view dashboard');
    error.statusCode = 400;
    throw error;
  }

  const { data: institution, error: institutionError } = await supabase
    .from('institutions')
    .select('name')
    .eq('id', institutionId)
    .single();
  if (institutionError) throw institutionError;

  const { data: students, error: studentsError } = await supabase
    .from('profiles')
    .select('id')
    .eq('institution_id', institutionId)
    .eq('role', 'student');

  if (studentsError) throw studentsError;

  const totalStudents = (students || []).length;
  if (totalStudents === 0) {
    return {
      institution_id: institutionId,
      institution_name: institution?.name || 'Unknown Institution',
      total_students: 0,
      lesson_completion_rate: 0,
      average_quiz_score: 0,
      drill_participation_rate: 0,
      preparedness_score: 0,
    };
  }

  const studentIds = students.map((s) => s.id);

  const { count: totalLessonsCount, error: totalLessonsCountError } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true });
  if (totalLessonsCountError) throw totalLessonsCountError;

  const totalLessons = totalLessonsCount || 0;
  const maxPossibleLessonCompletions = totalStudents * totalLessons;

  const { count: completedLessonsCount, error: completedLessonsCountError } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .in('user_id', studentIds);
  if (completedLessonsCountError) throw completedLessonsCountError;

  const lessonCompletionRate = maxPossibleLessonCompletions > 0
    ? Math.min(100, Math.round(((completedLessonsCount || 0) / maxPossibleLessonCompletions) * 100))
    : 0;

  const { data: quizAttempts, error: quizAttemptsError } = await supabase
    .from('quiz_attempts')
    .select('score')
    .in('user_id', studentIds);
  if (quizAttemptsError) throw quizAttemptsError;

  const quizScores = (quizAttempts || []).map((q) => Number(q.score));
  const totalQuizScore = quizScores.reduce((sum, score) => sum + score, 0);
  const averageQuizScore = quizScores.length > 0
    ? Math.round(totalQuizScore / quizScores.length)
    : 0;

  const { data: drillAttempts, error: drillAttemptsError } = await supabase
    .from('drill_attempts')
    .select('user_id')
    .in('user_id', studentIds);
  if (drillAttemptsError) throw drillAttemptsError;

  const participatingStudents = new Set((drillAttempts || []).map((d) => d.user_id));
  const drillParticipationRate = Math.min(
    100,
    Math.round((participatingStudents.size / totalStudents) * 100)
  );

  const preparednessScore = Math.round(
    (lessonCompletionRate + averageQuizScore + drillParticipationRate) / 3
  );

  return {
    institution_id: institutionId,
    institution_name: institution?.name || 'Unknown Institution',
    total_students: totalStudents,
    lesson_completion_rate: lessonCompletionRate,
    average_quiz_score: averageQuizScore,
    drill_participation_rate: drillParticipationRate,
    preparedness_score: preparednessScore,
    metrics: {
      total_lessons: totalLessons,
      completed_lessons_count: completedLessonsCount || 0,
      total_quiz_attempts: (quizAttempts || []).length,
      drill_participants_count: participatingStudents.size,
    },
  };
};

