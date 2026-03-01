import { createClient } from "@/lib/supabase/server";

const DEFAULT_MILESTONES = [
  "Completed onboarding",
  "First week streak",
  "Control score reached 5",
  "Had 10 sessions with Dr. Maya",
  "Control score reaches 7",
  "Complete 4-week program",
  "Confidence score reaches 8",
  "Complete full program",
];

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

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("program_week, program_length")
    .eq("id", userId)
    .maybeSingle();

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

  // Get streak (consecutive days with a score or session)
  const { data: recentScores } = await supabase
    .from("daily_scores")
    .select("logged_at")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(7);

  const now = new Date().toISOString();

  for (const milestone of uncompleted) {
    let shouldComplete = false;

    switch (milestone.label) {
      case "Completed onboarding":
        shouldComplete = true;
        break;
      case "First week streak":
        shouldComplete = (recentScores?.length ?? 0) >= 7;
        break;
      case "Control score reached 5":
        shouldComplete = (latestScore?.control_score ?? 0) >= 5;
        break;
      case "Had 10 sessions with Dr. Maya":
        shouldComplete = (sessionCount ?? 0) >= 10;
        break;
      case "Control score reaches 7":
        shouldComplete = (latestScore?.control_score ?? 0) >= 7;
        break;
      case "Complete 4-week program":
        shouldComplete = (profile?.program_week ?? 0) >= 4;
        break;
      case "Confidence score reaches 8":
        shouldComplete = (latestScore?.confidence_score ?? 0) >= 8;
        break;
      case "Complete full program":
        shouldComplete =
          (profile?.program_week ?? 0) >= (profile?.program_length ?? 8);
        break;
    }

    if (shouldComplete) {
      await supabase
        .from("milestones")
        .update({ completed: true, completed_at: now })
        .eq("id", milestone.id);
    }
  }
}
