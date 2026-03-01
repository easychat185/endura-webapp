import { BaseAgent } from "../base-agent";
import { getAdminClient } from "../supabase-admin";
import { getMasterCoordinatorPrompt } from "../prompts/master-coordinator-prompt";
import type { AgentType, AgentRunParams, AgentActionItem, DailySummary } from "../types";
import { SPECIALIZED_AGENT_TYPES } from "../types";

export class MasterCoordinatorAgent extends BaseAgent {
  readonly agentType: AgentType = "master-coordinator";
  readonly model = "claude-sonnet-4-6";
  readonly maxTokens = 4096;
  readonly label = "Master Coordinator";

  getSystemPrompt(): string {
    return getMasterCoordinatorPrompt();
  }

  async buildUserMessage(_params: AgentRunParams): Promise<string> {
    const supabase = getAdminClient();

    // Fetch latest report for each specialized agent
    const reportSections: string[] = [];

    for (const agentType of SPECIALIZED_AGENT_TYPES) {
      const { data: reports } = await supabase
        .from("agent_reports")
        .select("report, summary, created_at")
        .eq("agent_type", agentType)
        .order("created_at", { ascending: false })
        .limit(1);

      if (reports && reports.length > 0) {
        const r = reports[0];
        const reportJson = JSON.stringify(r.report, null, 2);
        // Truncate very large reports
        const truncated =
          reportJson.length > 8000
            ? reportJson.slice(0, 8000) + "\n... (truncated)"
            : reportJson;
        reportSections.push(
          `\n=== ${agentType.toUpperCase()} REPORT ===\nSummary: ${r.summary}\nFull Report:\n${truncated}\n`
        );
      } else {
        reportSections.push(
          `\n=== ${agentType.toUpperCase()} REPORT ===\nNo report available.\n`
        );
      }
    }

    return `Synthesize the following 5 agent reports into a unified strategic brief. Return valid JSON only.\n\n${reportSections.join("\n")}`;
  }

  parseResponse(text: string): {
    data: Record<string, unknown>;
    actionItems: AgentActionItem[];
  } {
    const parsed = JSON.parse(text);
    const actionItems: AgentActionItem[] = (parsed.actionItems ?? []).map(
      (item: Record<string, unknown>) => ({
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        priority: Number(item.priority ?? 5),
        category: item.category ? String(item.category) : "strategy",
      })
    );
    return { data: parsed, actionItems };
  }

  async saveDailySummary(
    reportData: Record<string, unknown>,
    agentRunIds: string[],
    totalCost: number
  ): Promise<void> {
    const supabase = getAdminClient();
    const today = new Date().toISOString().split("T")[0];

    const summary: Omit<DailySummary, "summaryDate"> & { summary_date: string } = {
      summary_date: today,
      executive_summary: String(reportData.executiveSummary ?? ""),
      cross_cutting_patterns: (reportData.crossCuttingPatterns ?? []) as string[],
      top_priorities: (reportData.topPriorities ?? []) as DailySummary["topPriorities"],
      conflicts: (reportData.conflicts ?? []) as string[],
      gaps: (reportData.gaps ?? []) as string[],
      strategic_recommendations: (reportData.strategicRecommendations ?? []) as string[],
      agent_run_ids: agentRunIds,
      total_cost_usd: totalCost,
    } as Record<string, unknown> as typeof summary;

    // Upsert by date
    await supabase
      .from("agent_daily_summaries")
      .upsert(summary, { onConflict: "summary_date" });
  }
}
