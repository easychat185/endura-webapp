import Anthropic from "@anthropic-ai/sdk";
import { getAdminClient } from "./supabase-admin";
import { SPECIALIZED_AGENT_TYPES } from "./types";
import { DEFAULT_AGENT_MODEL } from "@/lib/ai/models";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are the Endura Master Agent — a strategic AI advisor for the Endura app (male sexual wellness coaching platform). You communicate via Telegram with the founder (Ariel).

## Your Role
- You are the Chief Strategy Officer synthesizing insights from 5 specialized agents:
  1. Market Research Agent — competitors, personas, positioning
  2. Marketing Content Agent — copy, campaigns, App Store listing
  3. Code Quality Agent — bugs, security, performance
  4. UI/UX Agent — usability, accessibility, design
  5. Dr. Maya Knowledge Agent — therapy quality, knowledge gaps

## How You Behave
- Conversational, concise, direct — this is Telegram, not a report
- Use short paragraphs and bullet points
- When asked about specific areas, pull from the latest agent reports in the database
- You can trigger agent runs when asked (tell the user you're doing it)
- Give actionable advice, not vague suggestions
- Be opinionated — recommend specific priorities
- Use Hebrew when Ariel writes in Hebrew, English when he writes in English

## Available Commands (tell user about these if they ask)
- "run [agent-name]" — triggers a specific agent
- "run all" — triggers all agents + coordination
- "status" — shows latest run status for each agent
- "priorities" — shows top action items
- "costs" — shows spending summary
- "summary" — shows latest executive summary

## Important Context
- Stack: Next.js 16, Supabase, Claude API, Tailwind CSS 4, Framer Motion
- App Store deployment planned
- Stripe disabled, all users get "pro" tier
- Target audience: men 18-45 with PE concerns`;

// In-memory conversation history per chat (resets on server restart)
const chatHistories = new Map<number, { role: "user" | "assistant"; content: string }[]>();
const MAX_HISTORY = 20;

export async function handleTelegramMessage(
  chatId: number,
  text: string
): Promise<string> {
  // Handle commands
  const lower = text.toLowerCase().trim();

  if (lower === "status") return await getStatusSummary();
  if (lower === "priorities") return await getPriorities();
  if (lower === "costs") return await getCostsSummary();
  if (lower === "summary") return await getLatestSummary();

  // Build conversation history
  let history = chatHistories.get(chatId) ?? [];
  history.push({ role: "user", content: text });

  // Trim history
  if (history.length > MAX_HISTORY) {
    history = history.slice(-MAX_HISTORY);
  }

  // Fetch latest context from DB for the AI
  const context = await getAgentContext();

  const response = await anthropic.messages.create({
    model: DEFAULT_AGENT_MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT + "\n\n## Full Agent Reports & Data\n" + context,
    messages: history,
  });

  const block = response.content[0];
  const reply = block.type === "text" ? block.text : "Sorry, I couldn't process that.";

  history.push({ role: "assistant", content: reply });
  chatHistories.set(chatId, history);

  return reply;
}

async function getAgentContext(): Promise<string> {
  const supabase = getAdminClient();
  let context = "";

  // Latest daily summary (coordinator synthesis)
  const { data: summary } = await supabase
    .from("agent_daily_summaries")
    .select("*")
    .order("summary_date", { ascending: false })
    .limit(1);

  if (summary?.[0]) {
    const s = summary[0];
    context += `=== MASTER COORDINATOR SUMMARY (${s.summary_date}) ===\n`;
    context += `Executive Summary:\n${s.executive_summary}\n\n`;

    if (Array.isArray(s.top_priorities) && s.top_priorities.length > 0) {
      context += "Top Priorities:\n";
      s.top_priorities.forEach((p: { title?: string; description?: string; rank?: number; effort?: string; impact?: string }, i: number) => {
        context += `${p.rank ?? i + 1}. ${p.title} — ${p.description ?? ""} (effort: ${p.effort ?? "?"}, impact: ${p.impact ?? "?"})\n`;
      });
      context += "\n";
    }

    if (Array.isArray(s.cross_cutting_patterns) && s.cross_cutting_patterns.length > 0) {
      context += "Cross-Cutting Patterns:\n";
      s.cross_cutting_patterns.forEach((p: { pattern?: string; implication?: string } | string) => {
        if (typeof p === "string") context += `- ${p}\n`;
        else context += `- ${p.pattern}${p.implication ? " — " + p.implication : ""}\n`;
      });
      context += "\n";
    }

    if (Array.isArray(s.strategic_recommendations) && s.strategic_recommendations.length > 0) {
      context += "Strategic Recommendations:\n";
      s.strategic_recommendations.forEach((r: { title?: string; description?: string; timeframe?: string } | string) => {
        if (typeof r === "string") context += `- ${r}\n`;
        else context += `- [${r.timeframe ?? "?"}] ${r.title}: ${r.description ?? ""}\n`;
      });
      context += "\n";
    }

    if (Array.isArray(s.gaps) && s.gaps.length > 0) {
      context += "Gaps:\n";
      s.gaps.forEach((g: { area?: string; description?: string } | string) => {
        if (typeof g === "string") context += `- ${g}\n`;
        else context += `- ${g.area}: ${g.description ?? ""}\n`;
      });
      context += "\n";
    }
  }

  // Full reports from each specialized agent (latest per agent)
  for (const agentType of SPECIALIZED_AGENT_TYPES) {
    const { data } = await supabase
      .from("agent_reports")
      .select("report, summary, created_at")
      .eq("agent_type", agentType)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data?.[0]) {
      const r = data[0];
      context += `\n=== ${agentType.toUpperCase()} FULL REPORT (${new Date(r.created_at).toLocaleDateString()}) ===\n`;
      context += `Summary: ${r.summary}\n\n`;
      // Include full report JSON — truncate if massive
      const reportJson = JSON.stringify(r.report, null, 2);
      if (reportJson.length > 12000) {
        context += reportJson.slice(0, 12000) + "\n... (truncated)\n";
      } else {
        context += reportJson + "\n";
      }
    }
  }

  // Open action items
  const { data: actionItems } = await supabase
    .from("agent_action_items")
    .select("title, priority, agent_type, status, description")
    .eq("status", "open")
    .order("priority", { ascending: false })
    .limit(20);

  if (actionItems?.length) {
    context += "\n=== OPEN ACTION ITEMS ===\n";
    actionItems.forEach((item, i) => {
      context += `${i + 1}. [P${item.priority}] [${item.agent_type}] ${item.title}: ${item.description ?? ""}\n`;
    });
  }

  return context || "No agent reports yet. Suggest running agents first.";
}

async function getStatusSummary(): Promise<string> {
  const supabase = getAdminClient();
  const lines: string[] = ["Agent Status:"];

  for (const agentType of [...SPECIALIZED_AGENT_TYPES, "master-coordinator" as const]) {
    const { data } = await supabase
      .from("agent_runs")
      .select("status, created_at, cost_usd, duration_ms")
      .eq("agent_type", agentType)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data?.[0]) {
      const r = data[0];
      const ago = formatTimeAgo(r.created_at);
      lines.push(`${getEmoji(r.status)} ${agentType}: ${r.status} (${ago}, $${Number(r.cost_usd).toFixed(4)})`);
    } else {
      lines.push(`⬜ ${agentType}: never run`);
    }
  }

  return lines.join("\n");
}

async function getPriorities(): Promise<string> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("agent_action_items")
    .select("title, priority, agent_type, status")
    .eq("status", "open")
    .order("priority", { ascending: false })
    .limit(10);

  if (!data?.length) return "No open action items. Run agents first.";

  const lines = ["Top Priorities:"];
  data.forEach((item, i) => {
    lines.push(`${i + 1}. [P${item.priority}] ${item.title} (${item.agent_type})`);
  });
  return lines.join("\n");
}

async function getCostsSummary(): Promise<string> {
  const supabase = getAdminClient();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: todayRuns } = await supabase
    .from("agent_runs")
    .select("cost_usd")
    .gte("created_at", `${today}T00:00:00Z`)
    .eq("status", "completed");

  const { data: weekRuns } = await supabase
    .from("agent_runs")
    .select("cost_usd")
    .gte("created_at", sevenDaysAgo)
    .eq("status", "completed");

  const todayCost = (todayRuns ?? []).reduce((s, r) => s + Number(r.cost_usd), 0);
  const weekCost = (weekRuns ?? []).reduce((s, r) => s + Number(r.cost_usd), 0);

  return `Costs:\nToday: $${todayCost.toFixed(4)}\n7-day: $${weekCost.toFixed(4)}\nBudget: $5.00/day`;
}

async function getLatestSummary(): Promise<string> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("agent_daily_summaries")
    .select("executive_summary, summary_date")
    .order("summary_date", { ascending: false })
    .limit(1);

  if (!data?.[0]) return "No summary yet. Run all agents first.";
  return `Summary (${data[0].summary_date}):\n\n${data[0].executive_summary}`;
}

function getEmoji(status: string): string {
  switch (status) {
    case "completed": return "✅";
    case "running": return "🔄";
    case "failed": return "❌";
    default: return "⏳";
  }
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
