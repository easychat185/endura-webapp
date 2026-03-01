import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getChallengesForUser, checkChallengeCompletion } from "@/lib/gamification/challenges";
import { awardXP } from "@/lib/gamification/xp";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getChallengesForUser(user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Challenges GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { actionType } = await request.json();

    if (!actionType) {
      return NextResponse.json({ error: "Missing actionType" }, { status: 400 });
    }

    const result = await checkChallengeCompletion(user.id, actionType);

    // If all challenges completed and bonus not yet claimed, award bonus
    if (result.allCompleted) {
      const today = new Date().toISOString().split("T")[0];
      const { data: record } = await supabase
        .from("daily_challenges")
        .select("bonus_claimed")
        .eq("user_id", user.id)
        .eq("challenge_date", today)
        .maybeSingle();

      if (record && !record.bonus_claimed) {
        await awardXP(user.id, 50, "challenge_bonus", `bonus_${today}`);
        await supabase
          .from("daily_challenges")
          .update({ bonus_claimed: true })
          .eq("user_id", user.id)
          .eq("challenge_date", today);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Challenges POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
