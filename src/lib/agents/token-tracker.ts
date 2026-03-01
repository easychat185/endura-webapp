import { getAdminClient } from "./supabase-admin";

// Cost per million tokens (USD)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4.0 },
};

const DEFAULT_DAILY_BUDGET_USD = 5.0;

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model] ?? MODEL_COSTS["claude-sonnet-4-6"];
  return (
    (inputTokens / 1_000_000) * costs.input +
    (outputTokens / 1_000_000) * costs.output
  );
}

export async function getDailySpend(): Promise<number> {
  const supabase = getAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("agent_runs")
    .select("cost_usd")
    .gte("created_at", `${today}T00:00:00Z`)
    .eq("status", "completed");

  if (!data) return 0;
  return data.reduce((sum, row) => sum + Number(row.cost_usd), 0);
}

export async function checkBudget(): Promise<{
  allowed: boolean;
  spent: number;
  budget: number;
}> {
  const budget =
    Number(process.env.AGENT_DAILY_BUDGET_USD) || DEFAULT_DAILY_BUDGET_USD;
  const spent = await getDailySpend();
  return { allowed: spent < budget, spent, budget };
}
