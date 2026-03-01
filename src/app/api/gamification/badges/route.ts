import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BADGE_DEFINITIONS } from "@/lib/gamification/badges";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get earned badges
    const { data: earnedBadges } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", user.id);

    const earnedMap = new Map(
      (earnedBadges ?? []).map((b) => [b.badge_id, b.earned_at])
    );

    // Merge with definitions
    const badges = BADGE_DEFINITIONS.map((def) => ({
      ...def,
      earned: earnedMap.has(def.id),
      earnedAt: earnedMap.get(def.id) ?? null,
    }));

    const earnedCount = badges.filter((b) => b.earned).length;
    const totalCount = badges.length;

    return NextResponse.json({
      badges,
      earnedCount,
      totalCount,
    });
  } catch (error) {
    console.error("Badges API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
