import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile (maybeSingle to avoid crash on missing row)
    const { data: profile } = await supabase
      .from("profiles")
      .select("program_week, program_length")
      .eq("id", user.id)
      .maybeSingle();

    // Get all daily scores (for charts)
    const { data: scores } = await supabase
      .from("daily_scores")
      .select("control_score, confidence_score, awareness_score, logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: true });

    // Get milestones
    const { data: milestones } = await supabase
      .from("milestones")
      .select("id, label, completed, completed_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    // Get session count
    const { count: sessionCount } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      profile: profile ?? { program_week: 1, program_length: 8 },
      scores: scores ?? [],
      milestones: milestones ?? [],
      sessionCount: sessionCount ?? 0,
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
