import { createClient } from "@/lib/supabase/server";

const DEFAULT_MILESTONES = [
  // Onboarding
  "Completed onboarding",

  // Tier milestones
  "Complete Tier 1: Foundation (Level 10)",
  "Complete Tier 2: Awakening (Level 20)",
  "Reach the Quarter Mark (Level 25)",
  "Complete Tier 3: Development (Level 30)",
  "Complete Tier 4: Strengthening (Level 40)",
  "Reach the Halfway Point (Level 50)",
  "Complete Tier 6: Refinement (Level 60)",
  "Complete Tier 7: Transformation (Level 70)",
  "Reach the Three-Quarter Mark (Level 75)",
  "Complete Tier 8: Mastery Preparation (Level 80)",
  "Complete Tier 9: Mastery (Level 90)",
  "Achieve Transcendence (Level 100)",

  // Score milestones
  "Control score reached 5",
  "Control score reached 7",
  "Confidence score reached 8",

  // Session milestones
  "Had 10 sessions with Dr. Maya",
  "Had 50 sessions with Dr. Maya",

  // Streak milestones
  "First week streak",
  "30-day streak",
];

// Map milestone labels to the level they require
const LEVEL_MILESTONES: Record<string, number> = {
  "Complete Tier 1: Foundation (Level 10)": 10,
  "Complete Tier 2: Awakening (Level 20)": 20,
  "Reach the Quarter Mark (Level 25)": 25,
  "Complete Tier 3: Development (Level 30)": 30,
  "Complete Tier 4: Strengthening (Level 40)": 40,
  "Reach the Halfway Point (Level 50)": 50,
  "Complete Tier 6: Refinement (Level 60)": 60,
  "Complete Tier 7: Transformation (Level 70)": 70,
  "Reach the Three-Quarter Mark (Level 75)": 75,
  "Complete Tier 8: Mastery Preparation (Level 80)": 80,
  "Complete Tier 9: Mastery (Level 90)": 90,
  "Achieve Transcendence (Level 100)": 100,
};

export async function generateInitialMilestones(userId: string) {
  const supabase = await createClient();

  // Check if milestones already exist
  const { count } = await supabase
    .from("milestones")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count > 0) return;

  const milestones = DEFAULT_MILESTONES.map((label) => ({
    user_id: userId,
    label,
    completed: label === "Completed onboarding",
    completed_at:
      label === "Completed onboarding" ? new Date().toISOString() : null,
  }));

  await supabase.from("milestones").insert(milestones);
}

export async function checkAndUpdateMilestones(userId: string) {
  const supabase = await createClient();

  // Get current milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, label, completed")
    .eq("user_id", userId);

  if (!milestones) return;

  const uncompleted = milestones.filter((m) => !m.completed);
  if (uncompleted.length === 0) return;

  // Get gamification state
  const { data: gam } = await supabase
    .from("user_gamification")
    .select("level, current_streak, longest_streak")
    .eq("user_id", userId)
    .maybeSingle();

  const userLevel = gam?.level ?? 1;
  const effectiveStreak = Math.max(gam?.current_streak ?? 0, gam?.longest_streak ?? 0);

  // Get latest scores
  const { data: latestScore } = await supabase
    .from("daily_scores")
    .select("control_score, confidence_score")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get session count
  const { count: sessionCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const now = new Date().toISOString();

  for (const milestone of uncompleted) {
    let shouldComplete = false;

    // Check level-based milestones dynamically
    if (milestone.label in LEVEL_MILESTONES) {
      shouldComplete = userLevel >= LEVEL_MILESTONES[milestone.label];
    } else {
      switch (milestone.label) {
        case "Completed onboarding":
          shouldComplete = true;
          break;
        case "First week streak":
          shouldComplete = effectiveStreak >= 7;
          break;
        case "30-day streak":
          shouldComplete = effectiveStreak >= 30;
          break;
        case "Control score reached 5":
          shouldComplete = (latestScore?.control_score ?? 0) >= 5;
          break;
        case "Control score reached 7":
          shouldComplete = (latestScore?.control_score ?? 0) >= 7;
          break;
        case "Confidence score reached 8":
          shouldComplete = (latestScore?.confidence_score ?? 0) >= 8;
          break;
        case "Had 10 sessions with Dr. Maya":
          shouldComplete = (sessionCount ?? 0) >= 10;
          break;
        case "Had 50 sessions with Dr. Maya":
          shouldComplete = (sessionCount ?? 0) >= 50;
          break;
      }
    }

    if (shouldComplete) {
      await supabase
        .from("milestones")
        .update({ completed: true, completed_at: now })
        .eq("id", milestone.id);
    }
  }
}
