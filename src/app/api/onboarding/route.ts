import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInitialMilestones } from "@/lib/milestones";
import { initializeGamification, awardXP } from "@/lib/gamification/xp";
import { updateStreak } from "@/lib/gamification/streak";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Determine program length from answers
    let programLength = 8;
    if (body.duration === "More than 3 years" || body.control <= 3) {
      programLength = 10;
    } else if (
      body.duration === "Less than 6 months" &&
      body.control >= 6
    ) {
      programLength = 6;
    }

    // Save onboarding responses
    const { error: onboardingError } = await supabase
      .from("onboarding_responses")
      .insert({
        user_id: user.id,
        age: body.age,
        relationship: body.relationship,
        duration: body.duration,
        control: body.control,
        confidence: body.confidence,
        relationships: body.relationships,
        anxiety: body.anxiety,
        previous_attempts: body.previousAttempts,
        held_back: body.heldBack,
        activity: body.activity,
        stress: body.stress,
        sleep: body.sleep,
        goals: body.goals,
        timeline: body.timeline,
        commitment: body.commitment,
      });

    if (onboardingError) {
      console.error("Onboarding insert error:", onboardingError);
      return NextResponse.json(
        { error: "Failed to save onboarding" },
        { status: 500 }
      );
    }

    // Update profile
    await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        program_length: programLength,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Generate initial milestones
    await generateInitialMilestones(user.id);

    // Initialize gamification and award onboarding XP
    await initializeGamification(user.id);
    await updateStreak(user.id, "onboarding");
    await awardXP(user.id, 100, "onboarding", `onboarding_${user.id}`);

    return NextResponse.json({ success: true, programLength });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
