import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date().toISOString();

    const { data: events } = await supabase
      .from("xp_events")
      .select("id, title, description, multiplier, source_filter, starts_at, ends_at")
      .eq("active", true)
      .lte("starts_at", now)
      .gte("ends_at", now);

    return NextResponse.json({ events: events ?? [] });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
