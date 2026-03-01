import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { timingSafeEqual } from "crypto";

function checkAuth(request: NextRequest): boolean {
  const secret =
    request.headers.get("x-admin-secret") ||
    request.cookies.get("admin_token")?.value;
  const expected = process.env.AGENT_ADMIN_SECRET;
  if (!secret || !expected) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const agentType = searchParams.get("agentType");
    const minPriority = searchParams.get("minPriority");
    const limit = Number(searchParams.get("limit") ?? 50);
    const offset = Number(searchParams.get("offset") ?? 0);

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
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
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
