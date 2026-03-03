export type AgentType =
  | "market-research"
  | "marketing-content"
  | "code-quality"
  | "ui-ux"
  | "dr-maya-knowledge"
  | "master-coordinator";

export const ALL_AGENT_TYPES: AgentType[] = [
  "market-research",
  "marketing-content",
  "code-quality",
  "ui-ux",
  "dr-maya-knowledge",
  "master-coordinator",
];

export const SPECIALIZED_AGENT_TYPES: AgentType[] = ALL_AGENT_TYPES.filter(
  (t) => t !== "master-coordinator"
);

export const AGENT_LABELS: Record<AgentType, string> = {
  "market-research": "Market Research",
  "marketing-content": "Marketing Content",
  "code-quality": "Code Quality",
  "ui-ux": "UI/UX Analysis",
  "dr-maya-knowledge": "Dr. Maya Knowledge",
  "master-coordinator": "Master Coordinator",
};

export const AGENT_SHORT_LABELS: Record<AgentType, string> = {
  "market-research": "Market",
  "marketing-content": "Marketing",
  "code-quality": "Code",
  "ui-ux": "UI/UX",
  "dr-maya-knowledge": "Dr. Maya",
  "master-coordinator": "Coord.",
};

export interface AgentConfig {
  type: AgentType;
  model: string;
  maxTokens: number;
  temperature?: number;
  label: string;
  description: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
}

export interface AgentActionItem {
  title: string;
  description: string;
  priority: number; // 1-10
  category?: string;
}

export interface AgentReport {
  agentType: AgentType;
  data: Record<string, unknown>;
  summary: string;
  actionItems: AgentActionItem[];
}

export interface AgentRunResult {
  runId: string;
  agentType: AgentType;
  status: "completed" | "failed";
  report: AgentReport | null;
  tokenUsage: TokenUsage;
  durationMs: number;
  error?: string;
}

export interface DailySummary {
  summaryDate: string;
  executiveSummary: string;
  crossCuttingPatterns: string[];
  topPriorities: { title: string; priority: number; agent: string }[];
  conflicts: string[];
  gaps: string[];
  strategicRecommendations: string[];
  agentRunIds: string[];
  totalCostUsd: number;
}

export interface AgentRunParams {
  depth?: "quick" | "standard" | "deep";
  focus?: string;
}
