// Service handling business logic and Supabase queries for virtual drills.

import { supabase } from '../config/supabase.js';

/**
 * Sanitizes drill steps for student presentation by stripping points and feedback.
 * @param {Array} steps - Raw steps from the database.
 * @returns {Array} Sanitized steps containing only scenario text and action options.
 */
const sanitizeDrillSteps = (steps = []) => {
  return steps.map((stepItem) => ({
    step: stepItem.step,
    scenario: stepItem.scenario,
    options: (stepItem.options || []).map((opt) => ({
      action: opt.action,
    })),
  }));
};

/**
 * Normalizes user choices into a lookup map by step number.
 * @param {Array|object} choices - Incoming choices from client.
 * @returns {Map<number, string|number>} Map of step number to chosen action.
 */
const normalizeChoices = (choices) => {
  const map = new Map();
  if (Array.isArray(choices)) {
    choices.forEach((item) => {
      const stepNum = Number(item.step);
      const val = item.action !== undefined ? item.action : item.action_index;
      map.set(stepNum, val);
    });
  } else {
    Object.entries(choices).forEach(([k, v]) => {
      map.set(Number(k), v);
    });
  }
  return map;
};

/**
 * Finds the matching option for a given step based on user choice.
 * @param {object} step - Scenario step object.
 * @param {string|number} choice - Action text or index.
 * @returns {object|null} Matched option.
 */
const matchOption = (step, choice) => {
  const options = step.options || [];
  if (typeof choice === 'number' && options[choice]) {
    return options[choice];
  }
  return options.find(
    (opt) => choice && opt.action.trim().toLowerCase() === String(choice).trim().toLowerCase()
  ) || null;
};

/**
 * Awards drill points to student profile on first completion.
 * @param {string} userId - UUID of student.
 * @param {string} scenarioId - UUID of scenario.
 * @param {number} earnedPoints - Points earned.
 * @returns {Promise<number>} Points credited.
 */
const awardDrillPoints = async (userId, scenarioId, earnedPoints) => {
  const { data: prior } = await supabase
    .from('drill_attempts')
    .select('id')
    .eq('user_id', userId)
    .eq('scenario_id', scenarioId)
    .limit(1);

  if (prior && prior.length > 0) return 0;

  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();

  const newPoints = (profile?.points || 0) + earnedPoints;
  await supabase.from('profiles').update({ points: newPoints }).eq('id', userId);
  return earnedPoints;
};

/**
 * Retrieves all drill scenarios with steps prepared for student view.
 * @returns {Promise<Array>} List of drill scenarios.
 */
export const getDrillScenarios = async () => {
  const { data: drills, error } = await supabase
    .from('drill_scenarios')
    .select('id, title, steps, created_at')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (drills || []).map((drill) => ({
    id: drill.id,
    title: drill.title,
    steps: sanitizeDrillSteps(drill.steps),
    total_steps: (drill.steps || []).length,
    created_at: drill.created_at,
  }));
};

/**
 * Retrieves a single drill scenario by its ID.
 * @param {string} scenarioId - UUID of the drill.
 * @returns {Promise<object>} Drill scenario details.
 */
export const getDrillScenarioById = async (scenarioId) => {
  const { data: drill, error } = await supabase
    .from('drill_scenarios')
    .select('id, title, steps, created_at')
    .eq('id', scenarioId)
    .single();

  if (error || !drill) {
    const notFound = new Error('Drill scenario not found');
    notFound.statusCode = 404;
    throw notFound;
  }

  return {
    id: drill.id,
    title: drill.title,
    steps: sanitizeDrillSteps(drill.steps),
    total_steps: (drill.steps || []).length,
    created_at: drill.created_at,
  };
};

/**
 * Grades drill choices, records attempt, and awards points.
 * @param {string} scenarioId - UUID of scenario.
 * @param {string} userId - UUID of student.
 * @param {Array|object} rawChoices - Student selections.
 * @returns {Promise<object>} Grading results and feedback.
 */
export const submitDrillChoices = async (scenarioId, userId, rawChoices) => {
  const { data: drill, error } = await supabase
    .from('drill_scenarios')
    .select('id, title, steps')
    .eq('id', scenarioId)
    .single();

  if (error || !drill) {
    const notFound = new Error('Drill scenario not found');
    notFound.statusCode = 404;
    throw notFound;
  }

  const steps = drill.steps || [];
  const choiceMap = normalizeChoices(rawChoices);
  let totalPointsEarned = 0;
  let maxPossiblePoints = 0;

  const review = steps.map((step) => {
    const choice = choiceMap.get(step.step);
    const matched = matchOption(step, choice);
    const stepMax = Math.max(...step.options.map((o) => o.points || 0));
    const stepEarned = matched ? matched.points : 0;

    totalPointsEarned += stepEarned;
    maxPossiblePoints += stepMax;

    return {
      step: step.step,
      scenario: step.scenario,
      selected_action: matched ? matched.action : 'No action selected',
      points_earned: stepEarned,
      max_points: stepMax,
      feedback: matched ? matched.feedback : 'You did not select a valid action for this step.',
    };
  });

  const finalScore = maxPossiblePoints > 0 ? Math.round((totalPointsEarned / maxPossiblePoints) * 100) : 0;
  const pointsAwarded = await awardDrillPoints(userId, scenarioId, totalPointsEarned);

  await supabase.from('drill_attempts').insert({
    user_id: userId,
    scenario_id: scenarioId,
    score: finalScore,
  });

  return {
    scenario_id: scenarioId,
    title: drill.title,
    score: finalScore,
    total_points_earned: totalPointsEarned,
    max_possible_points: maxPossiblePoints,
    points_awarded: pointsAwarded,
    review,
  };
};

