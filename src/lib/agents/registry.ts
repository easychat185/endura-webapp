import type { AgentType } from "./types";
import { ALL_AGENT_TYPES } from "./types";
import type { BaseAgent } from "./base-agent";
import { MarketResearchAgent } from "./runners/market-research";
import { MarketingContentAgent } from "./runners/marketing-content";
import { CodeQualityAgent } from "./runners/code-quality";
import { UiUxAgent } from "./runners/ui-ux";
import { DrMayaKnowledgeAgent } from "./runners/dr-maya-knowledge";
import { MasterCoordinatorAgent } from "./runners/master-coordinator";

const AGENT_MAP: Record<AgentType, new () => BaseAgent> = {
  "market-research": MarketResearchAgent,
  "marketing-content": MarketingContentAgent,
  "code-quality": CodeQualityAgent,
  "ui-ux": UiUxAgent,
  "dr-maya-knowledge": DrMayaKnowledgeAgent,
  "master-coordinator": MasterCoordinatorAgent,
};

export function getAgent(type: AgentType): BaseAgent {
  const AgentClass = AGENT_MAP[type];
  if (!AgentClass) {
    throw new Error(`Unknown agent type: ${type}`);
  }
  return new AgentClass();
}

export { ALL_AGENT_TYPES };
