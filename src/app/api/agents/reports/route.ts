import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { requireAdminAuth } from "@/lib/agents/admin-auth";
import { parsePositiveInt } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const agentType = searchParams.get("agentType");
    const minPriority = searchParams.get("minPriority");
    const limit = parsePositiveInt(searchParams.get("limit"), 20, 100);
    const offset = parsePositiveInt(searchParams.get("offset"), 0, 10000);

    const supabase = getAdminClient();

    let query = supabase
      .from("agent_reports")
      .select("id, run_id, agent_type, summary, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (agentType) {
      query = query.eq("agent_type", agentType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If minPriority filter, also fetch action items
    if (minPriority) {
      const reportIds = (data ?? []).map((r) => r.id);
      if (reportIds.length > 0) {
        const { data: items } = await supabase
          .from("agent_action_items")
          .select("*")
          .in("report_id", reportIds)
          .gte("priority", Number(minPriority))
          .order("priority", { ascending: false });

        return NextResponse.json({ reports: data, actionItems: items ?? [] });
      }
    }

    return NextResponse.json({ reports: data ?? [] });
  } catch (error) {
    console.error("Reports list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
