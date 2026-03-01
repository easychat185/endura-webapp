/* Central XP Engine — single entry point for all XP awards */

import { createClient } from "@/lib/supabase/server";
import { getLevelFromXP, getStreakMultiplier } from "./levels";
import { checkBadges } from "./badges";

export type XPSource =
  | "exercise"
  | "chat_session"
  | "daily_scores"
  | "onboarding"
  | "badge"
  | "daily_login"
  | "challenge"
  | "challenge_bonus";

export interface XPResult {
  xpEarned: number;
  multiplier: number;
  newTotalXP: number;
  newLevel: number;
  previousLevel: number;
  levelUp: boolean;
  badgesEarned: { id: string; label: string; rarity: string; xp_reward: number }[];
}

/**
 * Award XP to a user. Handles deduplication, streak multiplier, event multiplier,
 * records transaction, checks level-up, and checks badges.
 */
export async function awardXP(
  userId: string,
  amount: number,
  source: XPSource,
  sourceId?: string
): Promise<XPResult> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Deduplication: check if this source+sourceId+date already awarded
  if (sourceId) {
    const { data: existing } = await supabase
      .from("xp_transactions")
      .select("id")
      .eq("user_id", userId)
      .eq("source", source)
      .eq("source_id", sourceId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Already awarded for this source, return current state
      const { data: gam } = await supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const level = getLevelFromXP(gam?.total_xp ?? 0);
      return {
        xpEarned: 0,
        multiplier: 1,
        newTotalXP: gam?.total_xp ?? 0,
        newLevel: level.level,
        previousLevel: level.level,
        levelUp: false,
        badgesEarned: [],
      };
    }
  }

  // For daily-capped sources, check if already awarded today
  const dailyCapped: XPSource[] = ["daily_scores", "daily_login"];
  if (dailyCapped.includes(source)) {
    const { data: todayTx } = await supabase
      .from("xp_transactions")
      .select("id")
      .eq("user_id", userId)
      .eq("source", source)
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59.999`)
      .limit(1)
      .maybeSingle();

    if (todayTx) {
      const { data: gam } = await supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const level = getLevelFromXP(gam?.total_xp ?? 0);
      return {
        xpEarned: 0,
        multiplier: 1,
        newTotalXP: gam?.total_xp ?? 0,
        newLevel: level.level,
        previousLevel: level.level,
        levelUp: false,
        badgesEarned: [],
      };
    }
  }

  // Get current gamification state
  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const currentXP = gamification?.total_xp ?? 0;
  const currentStreak = gamification?.current_streak ?? 0;
  const previousLevel = getLevelFromXP(currentXP).level;

  // Calculate multiplier: streak * active event
  const { multiplier: streakMult } = getStreakMultiplier(currentStreak);

  // Check for active XP events
  let eventMult = 1.0;
  const now = new Date().toISOString();
  const { data: activeEvents } = await supabase
    .from("xp_events")
    .select("multiplier, source_filter")
    .eq("active", true)
    .lte("starts_at", now)
    .gte("ends_at", now);

  if (activeEvents) {
    for (const evt of activeEvents) {
      if (!evt.source_filter || evt.source_filter === source) {
        eventMult = Math.max(eventMult, evt.multiplier);
      }
    }
  }

  const totalMultiplier = streakMult * eventMult;
  const finalAmount = Math.round(amount * totalMultiplier);
  const newTotalXP = currentXP + finalAmount;

  // Record transaction
  await supabase.from("xp_transactions").insert({
    user_id: userId,
    amount: finalAmount,
    source,
    source_id: sourceId ?? `${source}_${today}`,
    multiplier: totalMultiplier,
  });

  // Update gamification state
  const newLevel = getLevelFromXP(newTotalXP);

  // Check if we should award streak shields on level-up
  let newShields = gamification?.streak_shields ?? 0;
  if (newLevel.level >= 7 && previousLevel < 7) newShields += 1;
  if (newLevel.level >= 11 && previousLevel < 11) newShields += 1;

  if (gamification) {
    await supabase
      .from("user_gamification")
      .update({
        total_xp: newTotalXP,
        level: newLevel.level,
        streak_shields: newShields,
      })
      .eq("user_id", userId);
  } else {
    await supabase.from("user_gamification").insert({
      user_id: userId,
      total_xp: newTotalXP,
      level: newLevel.level,
      streak_shields: newShields,
    });
  }

  // Check badges
  const badgesEarned = await checkBadges(userId, { source, newTotalXP, newLevel: newLevel.level });

  // Award XP for earned badges (without recursion — badge XP doesn't trigger more badge checks)
  for (const badge of badgesEarned) {
    if (badge.xp_reward > 0) {
      const badgeXP = Math.round(badge.xp_reward * totalMultiplier);
      await supabase.from("xp_transactions").insert({
        user_id: userId,
        amount: badgeXP,
        source: "badge",
        source_id: badge.id,
        multiplier: totalMultiplier,
      });
      await supabase
        .from("user_gamification")
        .update({ total_xp: newTotalXP + badgeXP })
        .eq("user_id", userId);
    }
  }

  return {
    xpEarned: finalAmount,
    multiplier: totalMultiplier,
    newTotalXP,
    newLevel: newLevel.level,
    previousLevel,
    levelUp: newLevel.level > previousLevel,
    badgesEarned,
  };
}

/** Initialize gamification row for a new user */
export async function initializeGamification(userId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("user_gamification")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("user_gamification").insert({
      user_id: userId,
      total_xp: 0,
      level: 1,
      current_streak: 0,
      longest_streak: 0,
      streak_shields: 0,
      leaderboard_opt_in: false,
    });
  }
}
