import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "weekly";

    // Determine period key
    const now = new Date();
    let periodKey: string;
    if (period === "weekly") {
      // Week starts on Sunday
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      periodKey = startOfWeek.toISOString().split("T")[0];
    } else if (period === "monthly") {
      periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    } else {
      periodKey = "alltime";
    }

    // Get leaderboard (only opted-in users)
    const { data: entries } = await supabase
      .from("leaderboard_cache")
      .select("*")
      .eq("period", period)
      .eq("period_key", periodKey)
      .order("rank", { ascending: true })
      .limit(50);

    // Get user's own entry
    const { data: myEntry } = await supabase
      .from("leaderboard_cache")
      .select("*")
      .eq("user_id", user.id)
      .eq("period", period)
      .eq("period_key", periodKey)
      .maybeSingle();

    // Check if user opted in
    const { data: gam } = await supabase
      .from("user_gamification")
      .select("leaderboard_opt_in")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      entries: entries ?? [],
      myEntry,
      optedIn: gam?.leaderboard_opt_in ?? false,
      period,
      periodKey,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
