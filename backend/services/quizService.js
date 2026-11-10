// Service handling quiz retrieval, answer evaluation, score grading, and reward points.

import { supabase } from '../config/supabase.js';

const PASSING_SCORE_PERCENTAGE = 60;
const REWARD_POINTS_FOR_PASS = 50;

/**
 * Normalizes submitted answers from either an array or key-value object into a Map.
 * @param {Array|object} answers - Incoming student answers.
 * @returns {Map<string, string>} Normalized map of questionId -> answer.
 */
const normalizeAnswers = (answers) => {
  if (Array.isArray(answers)) {
    return new Map(answers.map((item) => [item.question_id, item.answer]));
  }
  return new Map(Object.entries(answers));
};

/**
 * Updates student points upon passing a quiz for the first time.
 * @param {string} userId - UUID of the student.
 * @param {string} moduleId - UUID of the module.
 * @returns {Promise<number>} Number of reward points awarded (0 or 50).
 */
const awardPointsIfFirstPass = async (userId, moduleId) => {
  const { data: priorPasses } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .gte('score', PASSING_SCORE_PERCENTAGE)
    .limit(1);

  if (priorPasses && priorPasses.length > 0) {
    return 0; // Already passed previously; no duplicate reward points
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();

  const updatedPoints = (profile?.points || 0) + REWARD_POINTS_FOR_PASS;
  await supabase.from('profiles').update({ points: updatedPoints }).eq('id', userId);
  return REWARD_POINTS_FOR_PASS;
};

/**
 * Retrieves quiz questions for a module with correct answers hidden.
 * @param {string} moduleId - UUID of the disaster learning module.
 * @returns {Promise<object>} Quiz questions and metadata without correct answers.
 */
export const getQuizByModuleId = async (moduleId) => {
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id, title')
    .eq('id', moduleId)
    .single();

  if (moduleError || !moduleData) {
    const error = new Error('Learning module not found');
    error.statusCode = 404;
    throw error;
  }

  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, module_id, question, options, created_at')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });

  if (questionsError) throw questionsError;

  return {
    module_id: moduleData.id,
    module_title: moduleData.title,
    total_questions: (questions || []).length,
    questions: questions || [],
  };
};

/**
 * Evaluates student answers, calculates score, records attempt, and awards points.
 * @param {string} moduleId - UUID of the learning module.
 * @param {string} userId - UUID of the submitting student.
 * @param {Array|object} rawAnswers - Answers provided by student.
 * @returns {Promise<object>} Grading result with review and points.
 */
export const submitQuizAnswers = async (moduleId, userId, rawAnswers) => {
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, question, options, correct_answer')
    .eq('module_id', moduleId);

  if (questionsError || !questions || questions.length === 0) {
    const error = new Error('No quiz questions found for this module');
    error.statusCode = 404;
    throw error;
  }

  const answerMap = normalizeAnswers(rawAnswers);
  let correctCount = 0;

  const review = questions.map((q) => {
    const studentAnswer = answerMap.get(q.id) || null;
    const isCorrect = Boolean(
      studentAnswer && studentAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
    );
    if (isCorrect) correctCount += 1;
    return {
      question_id: q.id,
      question: q.question,
      selected_answer: studentAnswer,
      correct_answer: q.correct_answer,
      is_correct: isCorrect,
    };
  });

  const score = Math.round((correctCount / questions.length) * 100);
  const isPassed = score >= PASSING_SCORE_PERCENTAGE;
  const pointsAwarded = isPassed ? await awardPointsIfFirstPass(userId, moduleId) : 0;

  const { error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert({ user_id: userId, module_id: moduleId, score });

  if (attemptError) throw attemptError;

  return {
    module_id: moduleId,
    score,
    total_questions: questions.length,
    correct_count: correctCount,
    is_passed: isPassed,
    passing_threshold: PASSING_SCORE_PERCENTAGE,
    points_awarded: pointsAwarded,
    review,
  };
};

