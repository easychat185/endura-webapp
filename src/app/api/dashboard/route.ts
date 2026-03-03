import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLevelFromXP, getXPForNextLevel, getStreakMultiplier } from "@/lib/gamification/levels";
import { getChallengesForUser } from "@/lib/gamification/challenges";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parallelize all independent queries
    const [
      profileRes,
      latestScoresRes,
      firstScoresRes,
      recentSessionsRes,
      sessionCountRes,
      gamRes,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, tier, program_week, program_length, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("daily_scores")
        .select("control_score, confidence_score, awareness_score, logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(1),
      supabase
        .from("daily_scores")
        .select("control_score, confidence_score")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: true })
        .limit(1),
      supabase
        .from("conversations")
        .select("id, session_number, summary, started_at")
        .eq("user_id", user.id)
        .not("summary", "is", null)
        .order("started_at", { ascending: false })
        .limit(3),
      supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const profile = profileRes.data;
    const latestScores = latestScoresRes.data?.[0] ?? null;
    const firstScores = firstScoresRes.data?.[0] ?? null;
    const recentSessions = recentSessionsRes.data;
    const sessionCount = sessionCountRes.count;
    const gam = gamRes.data;

    const totalXP = gam?.total_xp ?? 0;
    const levelDef = getLevelFromXP(totalXP);
    const nextLevel = getXPForNextLevel(levelDef.level);
    const { multiplier: streakMultiplier, label: streakLabel } = getStreakMultiplier(gam?.current_streak ?? 0);

    let xpInLevel = 0;
    let xpNeeded = 100;
    if (nextLevel) {
      xpInLevel = totalXP - levelDef.totalXP;
      xpNeeded = nextLevel.total - levelDef.totalXP;
    }

    // Daily challenges
    let challenges = null;
    try {
      challenges = await getChallengesForUser(user.id);
    } catch {
      // Challenges may fail if tables not yet created
    }

    // Active XP events
    const now = new Date().toISOString();
    const { data: activeEvents } = await supabase
      .from("xp_events")
      .select("id, title, description, multiplier, ends_at")
      .eq("active", true)
      .lte("starts_at", now)
      .gte("ends_at", now);

    return NextResponse.json({
      profile: profile ?? {
        display_name: user.email?.split("@")[0] ?? "User",
        tier: "free",
        program_week: 1,
        program_length: 8,
        onboarding_completed: false,
      },
      latestScores,
      firstScores,
      recentSessions: recentSessions ?? [],
      sessionCount: sessionCount ?? 0,
      gamification: {
        totalXP,
        level: levelDef.level,
        levelTitle: levelDef.title,
        tier: levelDef.tier,
        tierName: levelDef.tierName,
        xpInLevel,
        xpNeeded,
        currentStreak: gam?.current_streak ?? 0,
        longestStreak: gam?.longest_streak ?? 0,
        streakShields: gam?.streak_shields ?? 0,
        streakMultiplier,
        streakLabel,
      },
      challenges,
      activeEvents: activeEvents ?? [],
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
