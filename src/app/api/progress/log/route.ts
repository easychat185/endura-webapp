import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndUpdateMilestones } from "@/lib/milestones";
import { awardXP } from "@/lib/gamification/xp";
import { updateStreak } from "@/lib/gamification/streak";
import { checkChallengeCompletion } from "@/lib/gamification/challenges";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { controlScore, confidenceScore, awarenessScore } =
      await request.json();

    // Upsert today's score
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("daily_scores").upsert(
      {
        user_id: user.id,
        control_score: controlScore,
        confidence_score: confidenceScore,
        awareness_score: awarenessScore ?? null,
        logged_at: today,
      },
      { onConflict: "user_id,logged_at" }
    );

    if (error) {
      console.error("Score log error:", error);
      return NextResponse.json(
        { error: "Failed to save scores" },
        { status: 500 }
      );
    }

    // Check milestones (legacy)
    await checkAndUpdateMilestones(user.id);

    // Gamification: award XP, update streak, check challenges
    await updateStreak(user.id, "daily_scores");
    const xpResult = await awardXP(user.id, 25, "daily_scores", `scores_${today}`);
    await checkChallengeCompletion(user.id, "daily_scores");

    return NextResponse.json({
      success: true,
      xp: xpResult,
    });
  } catch (error) {
    console.error("Progress log API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
