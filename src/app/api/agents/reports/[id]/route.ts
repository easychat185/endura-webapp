import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { requireAdminAuth } from "@/lib/agents/admin-auth";
import { isValidUUID } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { id } = await params;

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data: report, error } = await supabase
      .from("agent_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Fetch action items for this report
    const { data: actionItems } = await supabase
      .from("agent_action_items")
      .select("*")
      .eq("report_id", id)
      .order("priority", { ascending: false });

    return NextResponse.json({ report, actionItems: actionItems ?? [] });
  } catch (error) {
    console.error("Report detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
