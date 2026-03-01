/* Streak Service — tracks real daily activity streaks */

import { createClient } from "@/lib/supabase/server";

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  shieldsRemaining: number;
  shieldUsed: boolean;
}

/**
 * Update streak for a qualifying action. Called on exercise, chat, score log, or login.
 * Upserts daily_activity and recalculates streak.
 */
export async function updateStreak(
  userId: string,
  actionType: string
): Promise<StreakResult> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Upsert today's activity
  const { data: existingActivity } = await supabase
    .from("daily_activity")
    .select("id, actions, xp_earned")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .maybeSingle();

  if (existingActivity) {
    // Update actions list
    const actions = existingActivity.actions || {};
    actions[actionType] = (actions[actionType] || 0) + 1;
    await supabase
      .from("daily_activity")
      .update({ actions })
      .eq("id", existingActivity.id);
  } else {
    await supabase.from("daily_activity").insert({
      user_id: userId,
      activity_date: today,
      actions: { [actionType]: 1 },
      xp_earned: 0,
      multiplier_applied: 1.0,
    });
  }

  // Get gamification state
  const { data: gam } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!gam) {
    return { currentStreak: 1, longestStreak: 1, shieldsRemaining: 0, shieldUsed: false };
  }

  const lastActiveDate = gam.last_active_date;
  let currentStreak = gam.current_streak || 0;
  let longestStreak = gam.longest_streak || 0;
  let shields = gam.streak_shields || 0;
  let shieldUsed = false;

  if (!lastActiveDate) {
    // First ever activity
    currentStreak = 1;
  } else {
    const last = new Date(lastActiveDate + "T00:00:00Z");
    const todayDate = new Date(today + "T00:00:00Z");
    const diffDays = Math.round(
      (todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Same day — streak unchanged
    } else if (diffDays === 1) {
      // Consecutive day
      currentStreak += 1;
    } else if (diffDays === 2 && shields > 0) {
      // Missed 1 day but shield available (grace period)
      shields -= 1;
      shieldUsed = true;
      currentStreak += 1; // Shield preserves + continues
    } else {
      // Streak broken
      currentStreak = 1;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  await supabase
    .from("user_gamification")
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      streak_shields: shields,
    })
    .eq("user_id", userId);

  return {
    currentStreak,
    longestStreak,
    shieldsRemaining: shields,
    shieldUsed,
  };
}
