import { BaseAgent } from "../base-agent";
import { getMarketingContentPrompt } from "../prompts/marketing-content-prompt";
import type { AgentType, AgentRunParams, AgentActionItem } from "../types";

export class MarketingContentAgent extends BaseAgent {
  readonly agentType: AgentType = "marketing-content";
  readonly model = "claude-sonnet-4-6";
  readonly maxTokens = 4096;
  readonly label = "Marketing Content";
  protected temperature = 0.7;

  getSystemPrompt(params: AgentRunParams): string {
    return getMarketingContentPrompt(params);
  }

  async buildUserMessage(params: AgentRunParams): Promise<string> {
    const focus = params.focus ?? "all marketing channels";
    return `Generate the marketing content strategy now. Focus: ${focus}. Return valid JSON only.`;
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
        category: item.category ? String(item.category) : "marketing",
      })
    );
    return { data: parsed, actionItems };
  }
}
