import { BaseAgent } from "../base-agent";
import { getMarketResearchPrompt } from "../prompts/market-research-prompt";
import type { AgentType, AgentRunParams, AgentActionItem } from "../types";
import { DEFAULT_AGENT_MODEL } from "@/lib/ai/models";

export class MarketResearchAgent extends BaseAgent {
  readonly agentType: AgentType = "market-research";
  readonly model = DEFAULT_AGENT_MODEL;
  readonly maxTokens = 4096;
  readonly label = "Market Research";

  getSystemPrompt(params: AgentRunParams): string {
    return getMarketResearchPrompt(params);
  }

  async buildUserMessage(params: AgentRunParams): Promise<string> {
    const focus = params.focus ?? "comprehensive analysis";
    return `Run the market research analysis now. Focus: ${focus}. Return valid JSON only.`;
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
        category: item.category ? String(item.category) : "market-research",
      })
    );
    return { data: parsed, actionItems };
  }
}
