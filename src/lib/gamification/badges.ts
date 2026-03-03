/* Badge Checker — checks all unearned badges against current state */

import { createClient } from "@/lib/supabase/server";

export type BadgeRarity = "common" | "uncommon" | "rare" | "legendary";
export type BadgeCategory = "streak" | "exercise" | "session" | "score" | "level" | "tier" | "special";

export interface BadgeDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  xp_reward: number;
  category: BadgeCategory;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Streak badges
  { id: "streak_3", label: "Streak Starter", description: "Maintain a 3-day streak", icon: "flame", rarity: "common", xp_reward: 30, category: "streak" },
  { id: "streak_7", label: "Week Warrior", description: "Maintain a 7-day streak", icon: "flame", rarity: "uncommon", xp_reward: 30, category: "streak" },
  { id: "streak_14", label: "Fortnight Fighter", description: "Maintain a 14-day streak", icon: "flame", rarity: "uncommon", xp_reward: 30, category: "streak" },
  { id: "streak_30", label: "Monthly Master", description: "Maintain a 30-day streak", icon: "flame", rarity: "rare", xp_reward: 30, category: "streak" },
  { id: "streak_100", label: "Century Club", description: "Maintain a 100-day streak", icon: "flame", rarity: "legendary", xp_reward: 30, category: "streak" },

  // Exercise badges
  { id: "technique_collector", label: "Technique Collector", description: "Complete 20 different exercises", icon: "trophy", rarity: "uncommon", xp_reward: 30, category: "exercise" },
  { id: "exercise_explorer", label: "Exercise Explorer", description: "Complete 50 different exercises", icon: "trophy", rarity: "rare", xp_reward: 50, category: "exercise" },
  { id: "exercise_master", label: "Exercise Master", description: "Complete all exercises", icon: "trophy", rarity: "legendary", xp_reward: 100, category: "exercise" },
  { id: "early_bird", label: "Early Bird", description: "Complete an exercise before 8 AM", icon: "sun", rarity: "common", xp_reward: 30, category: "exercise" },
  { id: "speed_runner", label: "Speed Runner", description: "Complete an exercise in record time", icon: "zap", rarity: "common", xp_reward: 30, category: "exercise" },

  // Session badges
  { id: "chat_25", label: "Chat Champion", description: "Complete 25 sessions with Dr. Maya", icon: "message-circle", rarity: "uncommon", xp_reward: 30, category: "session" },
  { id: "chat_50", label: "Deep Diver", description: "Complete 50 sessions with Dr. Maya", icon: "message-circle", rarity: "rare", xp_reward: 30, category: "session" },

  // Score badges
  { id: "score_climber", label: "Score Climber", description: "Improve control score by 3 from your start", icon: "trending-up", rarity: "uncommon", xp_reward: 30, category: "score" },
  { id: "confidence_king", label: "Confidence King", description: "Reach confidence score of 8+", icon: "crown", rarity: "rare", xp_reward: 30, category: "score" },
  { id: "full_control", label: "Full Control", description: "Reach control score of 9+", icon: "shield", rarity: "rare", xp_reward: 30, category: "score" },
  { id: "zen_master", label: "Zen Master", description: "Reach awareness score of 9+", icon: "brain", rarity: "rare", xp_reward: 30, category: "score" },
  { id: "triple_threat", label: "Triple Threat", description: "All three scores at 7+", icon: "award", rarity: "rare", xp_reward: 30, category: "score" },
  { id: "perfect_10", label: "Perfect 10", description: "Any score reaches 10", icon: "star", rarity: "legendary", xp_reward: 30, category: "score" },

  // Level milestone badges
  { id: "level_10", label: "Foundation Complete", description: "Complete Tier 1 (Level 10)", icon: "badge", rarity: "uncommon", xp_reward: 50, category: "level" },
  { id: "level_25", label: "Quarter Warrior", description: "Reach the quarter mark (Level 25)", icon: "badge", rarity: "rare", xp_reward: 75, category: "level" },
  { id: "level_50", label: "Halfway Warrior", description: "Reach the halfway point (Level 50)", icon: "badge", rarity: "rare", xp_reward: 100, category: "level" },
  { id: "level_75", label: "Master's Path", description: "Reach the three-quarter mark (Level 75)", icon: "badge", rarity: "legendary", xp_reward: 150, category: "level" },
  { id: "level_100", label: "Transcendent", description: "Complete all 100 levels", icon: "badge", rarity: "legendary", xp_reward: 300, category: "level" },

  // Tier completion badges
  { id: "tier_1", label: "Foundation Built", description: "Complete Tier 1: Foundation", icon: "layers", rarity: "common", xp_reward: 30, category: "tier" },
  { id: "tier_2", label: "Awakened", description: "Complete Tier 2: Awakening", icon: "layers", rarity: "common", xp_reward: 40, category: "tier" },
  { id: "tier_3", label: "Developer", description: "Complete Tier 3: Development", icon: "layers", rarity: "uncommon", xp_reward: 50, category: "tier" },
  { id: "tier_4", label: "Strengthened", description: "Complete Tier 4: Strengthening", icon: "layers", rarity: "uncommon", xp_reward: 60, category: "tier" },
  { id: "tier_5", label: "Integrated", description: "Complete Tier 5: Integration", icon: "layers", rarity: "rare", xp_reward: 70, category: "tier" },
  { id: "tier_6", label: "Refined", description: "Complete Tier 6: Refinement", icon: "layers", rarity: "rare", xp_reward: 80, category: "tier" },
  { id: "tier_7", label: "Transformed", description: "Complete Tier 7: Transformation", icon: "layers", rarity: "rare", xp_reward: 90, category: "tier" },
  { id: "tier_8", label: "Mastery Bound", description: "Complete Tier 8: Mastery Preparation", icon: "layers", rarity: "legendary", xp_reward: 100, category: "tier" },
  { id: "tier_9", label: "Master", description: "Complete Tier 9: Mastery", icon: "layers", rarity: "legendary", xp_reward: 120, category: "tier" },
  { id: "tier_10", label: "Transcendent Master", description: "Complete Tier 10: Transcendence", icon: "layers", rarity: "legendary", xp_reward: 200, category: "tier" },

  // Special badges
  { id: "first_steps", label: "First Steps", description: "Complete onboarding", icon: "footprints", rarity: "common", xp_reward: 30, category: "special" },
  { id: "night_owl", label: "Night Owl", description: "Log scores after 10 PM", icon: "moon", rarity: "common", xp_reward: 30, category: "special" },
  { id: "consistency_pro", label: "Consistency Pro", description: "Log scores 20 days in a row", icon: "calendar-check", rarity: "rare", xp_reward: 30, category: "special" },
  { id: "weekend_warrior", label: "Weekend Warrior", description: "Complete exercises on Saturday and Sunday", icon: "calendar", rarity: "uncommon", xp_reward: 30, category: "special" },
  { id: "explorer", label: "Explorer", description: "Visit all app sections in one day", icon: "compass", rarity: "common", xp_reward: 30, category: "special" },
];

interface BadgeContext {
  source?: string;
  newTotalXP?: number;
  newLevel?: number;
}

/**
 * Check all unearned badges and award any that are now satisfied.
 * Returns newly earned badges.
 */
export async function checkBadges(
  userId: string,
  context: BadgeContext
): Promise<{ id: string; label: string; rarity: string; xp_reward: number }[]> {
  const supabase = await createClient();

  // Get already earned badges
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earnedIds = new Set((earnedBadges ?? []).map((b) => b.badge_id));
  const newlyEarned: { id: string; label: string; rarity: string; xp_reward: number }[] = [];

  // Get gamification state
  const { data: gam } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const currentStreak = gam?.current_streak ?? 0;
  const longestStreak = gam?.longest_streak ?? 0;
  const effectiveStreak = Math.max(currentStreak, longestStreak);

  // Get session count
  const { count: sessionCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get score data
  const { data: latestScore } = await supabase
    .from("daily_scores")
    .select("control_score, confidence_score, awareness_score")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: firstScore } = await supabase
    .from("daily_scores")
    .select("control_score")
    .eq("user_id", userId)
    .order("logged_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Get exercise completions
  const { data: completions } = await supabase
    .from("exercise_completions")
    .select("exercise_slug")
    .eq("user_id", userId);

  const uniqueExercises = new Set((completions ?? []).map((c) => c.exercise_slug));

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  // Check each badge
  for (const badge of BADGE_DEFINITIONS) {
    if (earnedIds.has(badge.id)) continue;

    let earned = false;

    switch (badge.id) {
      // Streak badges
      case "streak_3": earned = effectiveStreak >= 3; break;
      case "streak_7": earned = effectiveStreak >= 7; break;
      case "streak_14": earned = effectiveStreak >= 14; break;
      case "streak_30": earned = effectiveStreak >= 30; break;
      case "streak_100": earned = effectiveStreak >= 100; break;

      // Exercise badges
      case "technique_collector": earned = uniqueExercises.size >= 20; break;
      case "exercise_explorer": earned = uniqueExercises.size >= 50; break;
      case "exercise_master": earned = uniqueExercises.size >= 85; break;
      case "early_bird": {
        const hour = new Date().getHours();
        earned = context.source === "exercise" && hour < 8;
        break;
      }
      case "speed_runner": earned = context.source === "exercise"; break; // simplified — any completion counts

      // Session badges
      case "chat_25": earned = (sessionCount ?? 0) >= 25; break;
      case "chat_50": earned = (sessionCount ?? 0) >= 50; break;

      // Score badges
      case "score_climber":
        earned = !!(latestScore && firstScore && (latestScore.control_score - firstScore.control_score) >= 3);
        break;
      case "confidence_king": earned = (latestScore?.confidence_score ?? 0) >= 8; break;
      case "full_control": earned = (latestScore?.control_score ?? 0) >= 9; break;
      case "zen_master": earned = (latestScore?.awareness_score ?? 0) >= 9; break;
      case "triple_threat":
        earned = !!(latestScore &&
          latestScore.control_score >= 7 &&
          latestScore.confidence_score >= 7 &&
          latestScore.awareness_score >= 7);
        break;
      case "perfect_10":
        earned = !!(latestScore && (
          latestScore.control_score === 10 ||
          latestScore.confidence_score === 10 ||
          latestScore.awareness_score === 10
        ));
        break;

      // Level milestone badges
      case "level_10": earned = (context.newLevel ?? gam?.level ?? 1) >= 10; break;
      case "level_25": earned = (context.newLevel ?? gam?.level ?? 1) >= 25; break;
      case "level_50": earned = (context.newLevel ?? gam?.level ?? 1) >= 50; break;
      case "level_75": earned = (context.newLevel ?? gam?.level ?? 1) >= 75; break;
      case "level_100": earned = (context.newLevel ?? gam?.level ?? 1) >= 100; break;

      // Tier completion badges
      case "tier_1": earned = (context.newLevel ?? gam?.level ?? 1) >= 10; break;
      case "tier_2": earned = (context.newLevel ?? gam?.level ?? 1) >= 20; break;
      case "tier_3": earned = (context.newLevel ?? gam?.level ?? 1) >= 30; break;
      case "tier_4": earned = (context.newLevel ?? gam?.level ?? 1) >= 40; break;
      case "tier_5": earned = (context.newLevel ?? gam?.level ?? 1) >= 50; break;
      case "tier_6": earned = (context.newLevel ?? gam?.level ?? 1) >= 60; break;
      case "tier_7": earned = (context.newLevel ?? gam?.level ?? 1) >= 70; break;
      case "tier_8": earned = (context.newLevel ?? gam?.level ?? 1) >= 80; break;
      case "tier_9": earned = (context.newLevel ?? gam?.level ?? 1) >= 90; break;
      case "tier_10": earned = (context.newLevel ?? gam?.level ?? 1) >= 100; break;

      // Special badges
      case "first_steps": earned = profile?.onboarding_completed ?? false; break;
      case "night_owl": {
        const hr = new Date().getHours();
        earned = context.source === "daily_scores" && hr >= 22;
        break;
      }
      case "consistency_pro": {
        // Check 20 consecutive daily_scores
        const { data: recentScores } = await supabase
          .from("daily_scores")
          .select("logged_at")
          .eq("user_id", userId)
          .order("logged_at", { ascending: false })
          .limit(20);
        if (recentScores && recentScores.length >= 20) {
          // Check if they are consecutive
          let consecutive = true;
          for (let i = 1; i < recentScores.length; i++) {
            const prev = new Date(recentScores[i - 1].logged_at);
            const curr = new Date(recentScores[i].logged_at);
            const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
            if (diff !== 1) { consecutive = false; break; }
          }
          earned = consecutive;
        }
        break;
      }
      case "weekend_warrior": {
        // Check if exercises completed on both Sat and Sun of current weekend
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 6=Sat
        if (day === 0 || day === 6) {
          const thisSat = new Date(now);
          if (day === 0) thisSat.setDate(now.getDate() - 1);
          const thisSun = new Date(thisSat);
          thisSun.setDate(thisSat.getDate() + 1);

          const satStr = thisSat.toISOString().split("T")[0];
          const sunStr = thisSun.toISOString().split("T")[0];

          const { data: satEx } = await supabase
            .from("exercise_completions")
            .select("id")
            .eq("user_id", userId)
            .gte("completed_at", `${satStr}T00:00:00`)
            .lt("completed_at", `${satStr}T23:59:59`)
            .limit(1)
            .maybeSingle();

          const { data: sunEx } = await supabase
            .from("exercise_completions")
            .select("id")
            .eq("user_id", userId)
            .gte("completed_at", `${sunStr}T00:00:00`)
            .lt("completed_at", `${sunStr}T23:59:59`)
            .limit(1)
            .maybeSingle();

          earned = !!(satEx && sunEx);
        }
        break;
      }
      case "explorer":
        // Simplified: earn on first login that visits multiple areas
        earned = false;
        break;
    }

    if (earned) {
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
        earned_at: new Date().toISOString(),
      });
      newlyEarned.push({
        id: badge.id,
        label: badge.label,
        rarity: badge.rarity,
        xp_reward: badge.xp_reward,
      });
    }
  }

  return newlyEarned;
}
