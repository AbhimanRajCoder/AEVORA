// Service handling leaderboard calculation and rankings for institutions.

import { supabase } from '../config/supabase.js';

const DEFAULT_LEADERBOARD_LIMIT = 20;

/**
 * Retrieves the student rankings within a specific institution based on accumulated points.
 * @param {string} institutionId - UUID of the institution.
 * @param {string} currentUserId - UUID of the requesting student.
 * @param {number} limit - Maximum number of top ranked students to return.
 * @returns {Promise<object>} Ranked student list and current user standing.
 */
export const getInstitutionLeaderboard = async (
  institutionId,
  currentUserId,
  limit = DEFAULT_LEADERBOARD_LIMIT
) => {
  if (!institutionId) {
    return {
      institution_id: null,
      leaderboard: [],
      current_user: null,
    };
  }

  const { data: students, error } = await supabase
    .from('profiles')
    .select('id, full_name, points')
    .eq('institution_id', institutionId)
    .eq('role', 'student')
    .order('points', { ascending: false });

  if (error) throw error;

  const rankedStudents = (students || []).map((student, index) => ({
    rank: index + 1,
    id: student.id,
    full_name: student.full_name,
    points: student.points || 0,
  }));

  const currentUserStanding = rankedStudents.find((s) => s.id === currentUserId) || null;
  const topList = rankedStudents.slice(0, limit);

  return {
    institution_id: institutionId,
    total_students: rankedStudents.length,
    leaderboard: topList,
    current_user: currentUserStanding,
  };
};

