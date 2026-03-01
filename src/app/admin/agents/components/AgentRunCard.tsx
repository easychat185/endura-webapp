"use client";

import { AgentStatusBadge } from "./AgentStatusBadge";

interface AgentRun {
  id: string;
  agent_type: string;
  status: string;
  cost_usd: number;
  duration_ms: number;
  total_tokens: number;
  created_at: string;
  error?: string;
}

const AGENT_LABELS: Record<string, string> = {
  "market-research": "Market Research",
  "marketing-content": "Marketing Content",
  "code-quality": "Code Quality",
  "ui-ux": "UI/UX Analysis",
  "dr-maya-knowledge": "Dr. Maya Knowledge",
  "master-coordinator": "Master Coordinator",
};

export function AgentRunCard({
  agentType,
  run,
  onRunNow,
  isRunning,
}: {
  agentType: string;
  run: AgentRun | null;
  onRunNow: () => void;
  isRunning: boolean;
}) {
  const label = AGENT_LABELS[agentType] ?? agentType;
  const timeAgo = run?.created_at ? formatTimeAgo(run.created_at) : "Never";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-white/70">{label}</h3>
          <p className="mt-1 text-[11px] text-white/30">Last run: {timeAgo}</p>
        </div>
        <AgentStatusBadge status={run?.status ?? null} />
      </div>

      {run && (
        <div className="mt-3 flex gap-4 text-[11px] text-white/25">
          <span>${Number(run.cost_usd).toFixed(4)}</span>
          <span>{(run.duration_ms / 1000).toFixed(1)}s</span>
          <span>{run.total_tokens} tok</span>
        </div>
      )}

      {run?.error && (
        <p className="mt-2 text-[11px] text-red-400/50 line-clamp-2">
          {run.error}
        </p>
      )}

      <button
        onClick={onRunNow}
        disabled={isRunning}
        className="mt-4 w-full rounded-xl px-4 py-2 text-xs font-medium text-amber-200/70 transition-all duration-300 hover:text-amber-200/90 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: "rgba(196,149,106,0.08)",
          border: "1px solid rgba(196,149,106,0.12)",
        }}
      >
        {isRunning ? "Running..." : "Run Now"}
      </button>
    </div>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
