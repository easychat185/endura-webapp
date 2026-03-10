import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { requireAdminAuth } from "@/lib/agents/admin-auth";
import { isValidUUID, parsePositiveInt } from "@/lib/validation";
import { ALL_AGENT_TYPES } from "@/lib/agents/types";

const VALID_STATUSES = ["open", "in_progress", "completed", "dismissed"] as const;

export async function GET(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const agentType = searchParams.get("agentType");
    const minPriority = searchParams.get("minPriority");
    const limit = parsePositiveInt(searchParams.get("limit"), 50, 100);
    const offset = parsePositiveInt(searchParams.get("offset"), 0, 10000);

    if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ error: `Invalid status. Valid: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    if (agentType && !ALL_AGENT_TYPES.includes(agentType as typeof ALL_AGENT_TYPES[number])) {
      return NextResponse.json({ error: "Invalid agentType" }, { status: 400 });
    }
    if (minPriority && parsePositiveInt(minPriority, -1, 10) === -1) {
      return NextResponse.json({ error: "Invalid minPriority" }, { status: 400 });
    }

    const supabase = getAdminClient();

    let query = supabase
      .from("agent_action_items")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (agentType) query = query.eq("agent_type", agentType);
    if (minPriority) query = query.gte("priority", Number(minPriority));

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ actionItems: data ?? [] });
  } catch (error) {
    console.error("Action items GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid action item ID" },
        { status: 400 }
      );
    }

    const validStatuses = ["open", "in_progress", "completed", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("agent_action_items")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ actionItem: data });
  } catch (error) {
    console.error("Action items PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
