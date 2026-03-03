import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLevelFromXP, getXPForNextLevel, getStreakMultiplier } from "@/lib/gamification/levels";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get gamification state
    const { data: gam } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const totalXP = gam?.total_xp ?? 0;
    const levelDef = getLevelFromXP(totalXP);
    const nextLevel = getXPForNextLevel(levelDef.level);
    const { multiplier, label: streakLabel } = getStreakMultiplier(gam?.current_streak ?? 0);

    // XP progress within current level
    let xpInLevel = 0;
    let xpNeeded = 100;
    if (nextLevel) {
      const currentLevelXP = levelDef.totalXP;
      xpInLevel = totalXP - currentLevelXP;
      xpNeeded = nextLevel.total - currentLevelXP;
    }

    // Recent XP gains (last 5)
    const { data: recentGains } = await supabase
      .from("xp_transactions")
      .select("amount, source, multiplier, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
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
      streakMultiplier: multiplier,
      streakLabel,
      leaderboardOptIn: gam?.leaderboard_opt_in ?? false,
      recentGains: recentGains ?? [],
    });
  } catch (error) {
    console.error("Gamification API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
