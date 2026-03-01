import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awardXP, type XPSource } from "@/lib/gamification/xp";
import { updateStreak } from "@/lib/gamification/streak";
import { checkChallengeCompletion } from "@/lib/gamification/challenges";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, source, sourceId } = await request.json() as {
      amount: number;
      source: XPSource;
      sourceId?: string;
    };

    if (!amount || !source) {
      return NextResponse.json({ error: "Missing amount or source" }, { status: 400 });
    }

    // Update streak
    await updateStreak(user.id, source);

    // Award XP
    const result = await awardXP(user.id, amount, source, sourceId);

    // Check challenges
    await checkChallengeCompletion(user.id, source);

    return NextResponse.json(result);
  } catch (error) {
    console.error("XP award error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
