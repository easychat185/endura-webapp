/* Daily Challenge Generator — deterministic selection via hash of user_id + date */

import { createClient } from "@/lib/supabase/server";

export interface Challenge {
  id: string;
  title: string;
  xp: number;
  type: string; // action type to match against
  completed: boolean;
}

interface ChallengeTemplate {
  id: string;
  title: string;
  xp: number;
  type: string;
}

const CHALLENGE_POOL: ChallengeTemplate[] = [
  { id: "any_exercise", title: "Complete any exercise", xp: 30, type: "exercise" },
  { id: "log_scores", title: "Log your daily scores", xp: 20, type: "daily_scores" },
  { id: "chat_session", title: "Have a session with Dr. Maya", xp: 30, type: "chat_session" },
  { id: "two_exercises", title: "Complete 2 different exercises", xp: 40, type: "exercise_x2" },
  { id: "scores_and_exercise", title: "Log scores and complete an exercise", xp: 35, type: "scores_and_exercise" },
  { id: "early_morning", title: "Use the app before 9 AM", xp: 20, type: "early_morning" },
  { id: "breathing_exercise", title: "Complete a breathing exercise", xp: 25, type: "breathing" },
  { id: "chat_5_msgs", title: "5+ message conversation with Dr. Maya", xp: 25, type: "chat_5_msgs" },
];

const WEEKLY_CHALLENGES: ChallengeTemplate[] = [
  { id: "weekly_5_exercises", title: "Complete 5 exercises this week", xp: 200, type: "weekly_exercises" },
  { id: "weekly_7_streak", title: "Maintain a 7-day streak", xp: 150, type: "weekly_streak" },
  { id: "weekly_daily_scores", title: "Log scores every day this week", xp: 175, type: "weekly_scores" },
];

/** Simple hash for deterministic challenge selection */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get today's 3 daily challenges for a user.
 * Deterministic: same user+date always gets same challenges.
 */
export async function getChallengesForUser(
  userId: string,
  date?: string
): Promise<{ challenges: Challenge[]; allCompleted: boolean; bonusClaimed: boolean }> {
  const supabase = await createClient();
  const today = date ?? new Date().toISOString().split("T")[0];

  // Check if challenges already generated for today
  const { data: existing } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_date", today)
    .maybeSingle();

  if (existing) {
    return {
      challenges: existing.challenges as Challenge[],
      allCompleted: existing.all_completed,
      bonusClaimed: existing.bonus_claimed,
    };
  }

  // Generate deterministic challenges
  const hash = simpleHash(`${userId}_${today}`);
  const indices: number[] = [];
  let attempt = 0;

  while (indices.length < 3 && attempt < 20) {
    const idx = (hash + attempt * 7 + attempt) % CHALLENGE_POOL.length;
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
    attempt++;
  }

  const challenges: Challenge[] = indices.map((idx) => ({
    ...CHALLENGE_POOL[idx],
    completed: false,
  }));

  // Store
  await supabase.from("daily_challenges").insert({
    user_id: userId,
    challenge_date: today,
    challenges,
    all_completed: false,
    bonus_claimed: false,
  });

  return { challenges, allCompleted: false, bonusClaimed: false };
}

/**
 * Check if a given action completes any of today's challenges.
 * Returns updated challenges.
 */
export async function checkChallengeCompletion(
  userId: string,
  actionType: string
): Promise<{ updated: boolean; challenges: Challenge[]; allCompleted: boolean }> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: record } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_date", today)
    .maybeSingle();

  if (!record) {
    return { updated: false, challenges: [], allCompleted: false };
  }

  const challenges = record.challenges as Challenge[];
  let updated = false;

  for (const challenge of challenges) {
    if (challenge.completed) continue;

    let matches = false;
    switch (challenge.type) {
      case "exercise":
        matches = actionType === "exercise";
        break;
      case "daily_scores":
        matches = actionType === "daily_scores";
        break;
      case "chat_session":
        matches = actionType === "chat_session";
        break;
      case "exercise_x2": {
        // Check if 2 different exercises completed today
        const { data: todayEx } = await supabase
          .from("exercise_completions")
          .select("exercise_slug")
          .eq("user_id", userId)
          .gte("completed_at", `${today}T00:00:00`)
          .lt("completed_at", `${today}T23:59:59.999`);
        const unique = new Set((todayEx ?? []).map((e) => e.exercise_slug));
        matches = unique.size >= 2;
        break;
      }
      case "scores_and_exercise": {
        const { data: todayScore } = await supabase
          .from("daily_scores")
          .select("id")
          .eq("user_id", userId)
          .eq("logged_at", today)
          .maybeSingle();
        const { data: todayExe } = await supabase
          .from("exercise_completions")
          .select("id")
          .eq("user_id", userId)
          .gte("completed_at", `${today}T00:00:00`)
          .lt("completed_at", `${today}T23:59:59.999`)
          .limit(1)
          .maybeSingle();
        matches = !!(todayScore && todayExe);
        break;
      }
      case "early_morning":
        matches = new Date().getHours() < 9;
        break;
      case "breathing":
        matches = actionType === "exercise_breathing";
        break;
      case "chat_5_msgs":
        matches = actionType === "chat_5_msgs";
        break;
    }

    if (matches) {
      challenge.completed = true;
      updated = true;
    }
  }

  if (updated) {
    const allCompleted = challenges.every((c) => c.completed);
    await supabase
      .from("daily_challenges")
      .update({ challenges, all_completed: allCompleted })
      .eq("id", record.id);

    return { updated: true, challenges, allCompleted };
  }

  return { updated: false, challenges, allCompleted: record.all_completed };
}

/**
 * Get the weekly challenge for a user (unlocks at level 10).
 */
export function getWeeklyChallenge(date?: string): ChallengeTemplate {
  const d = date ?? new Date().toISOString().split("T")[0];
  const hash = simpleHash(`weekly_${d.slice(0, 7)}`); // same for the whole month
  const weekNum = Math.floor(new Date(d).getDate() / 7);
  const idx = (hash + weekNum) % WEEKLY_CHALLENGES.length;
  return WEEKLY_CHALLENGES[idx];
}
