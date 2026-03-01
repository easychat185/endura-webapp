import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { ALL_AGENT_TYPES } from "@/lib/agents/types";
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
    const supabase = getAdminClient();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Batch all independent queries in parallel
    const [
      allLatestRes,
      totalRunsRes,
      actionItemsRes,
      runs7dRes,
      runs30dRes,
      latestSummaryRes,
    ] = await Promise.all([
      // Single query for latest runs — get recent runs for all agent types at once
      supabase
        .from("agent_runs")
        .select("*")
        .in("agent_type", ALL_AGENT_TYPES as unknown as string[])
        .order("created_at", { ascending: false }),
      supabase
        .from("agent_runs")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("agent_action_items")
        .select("status, priority, agent_type"),
      supabase
        .from("agent_runs")
        .select("cost_usd, agent_type")
        .gte("created_at", sevenDaysAgo)
        .eq("status", "completed"),
      supabase
        .from("agent_runs")
        .select("cost_usd")
        .gte("created_at", thirtyDaysAgo)
        .eq("status", "completed"),
      supabase
        .from("agent_daily_summaries")
        .select("*")
        .order("summary_date", { ascending: false })
        .limit(1),
    ]);

    // Group latest runs by agent type (pick first per type = most recent)
    const latestRuns: Record<string, unknown> = {};
    const seen = new Set<string>();
    for (const run of allLatestRes.data ?? []) {
      const type = run.agent_type as string;
      if (!seen.has(type)) {
        seen.add(type);
        latestRuns[type] = run;
      }
    }
    for (const t of ALL_AGENT_TYPES) {
      if (!latestRuns[t]) latestRuns[t] = null;
    }

    const totalRuns = totalRunsRes.count;

    // Action items by status
    const actionItemsByStatus = {
      open: 0,
      in_progress: 0,
      completed: 0,
      dismissed: 0,
    };
    for (const item of actionItemsRes.data ?? []) {
      const status = item.status as keyof typeof actionItemsByStatus;
      if (status in actionItemsByStatus) actionItemsByStatus[status]++;
    }

    // Costs — compute from the already-fetched 7d runs
    const runs7d = runs7dRes.data ?? [];
    const cost7d = runs7d.reduce((sum, r) => sum + Number(r.cost_usd), 0);
    const cost30d = (runs30dRes.data ?? []).reduce((sum, r) => sum + Number(r.cost_usd), 0);

    // Cost per agent (from the same 7d query, grouped in JS)
    const costPerAgent: Record<string, number> = {};
    for (const t of ALL_AGENT_TYPES) costPerAgent[t] = 0;
    for (const r of runs7d) {
      const type = r.agent_type as string;
      if (type in costPerAgent) costPerAgent[type] += Number(r.cost_usd);
    }

    const latestSummary = latestSummaryRes.data;

    return NextResponse.json({
      latestRuns,
      totalRuns: totalRuns ?? 0,
      actionItemsByStatus,
      costs: { sevenDay: cost7d, thirtyDay: cost30d, perAgent: costPerAgent },
      latestSummary: latestSummary?.[0] ?? null,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
