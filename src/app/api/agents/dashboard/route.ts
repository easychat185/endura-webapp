import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/agents/supabase-admin";
import { ALL_AGENT_TYPES } from "@/lib/agents/types";
import { requireAdminAuth } from "@/lib/agents/admin-auth";

export async function GET(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const supabase = getAdminClient();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Batch all independent queries in parallel
    const [
      allLatestRes,
      totalRunsRes,
      actionItemsRes,
      runs30dRes,
      latestSummaryRes,
    ] = await Promise.all([
      // Single query for latest runs — limit to 50 (6 agent types)
      supabase
        .from("agent_runs")
        .select("*")
        .in("agent_type", ALL_AGENT_TYPES as unknown as string[])
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("agent_runs")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("agent_action_items")
        .select("status, priority, agent_type"),
      // Single 30d query — compute 7d subset in JS
      supabase
        .from("agent_runs")
        .select("cost_usd, agent_type, created_at")
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

    // Costs — compute both 7d and 30d from a single 30d query
    const runs30d = runs30dRes.data ?? [];
    let cost7d = 0;
    let cost30d = 0;
    const costPerAgent: Record<string, number> = {};
    for (const t of ALL_AGENT_TYPES) costPerAgent[t] = 0;

    for (const r of runs30d) {
      const cost = Number(r.cost_usd);
      cost30d += cost;
      const isRecent = new Date(r.created_at as string) >= sevenDaysAgo;
      if (isRecent) {
        cost7d += cost;
        const type = r.agent_type as string;
        if (type in costPerAgent) costPerAgent[type] += cost;
      }
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
