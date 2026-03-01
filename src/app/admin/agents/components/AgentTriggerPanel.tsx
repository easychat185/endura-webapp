"use client";

import { useState } from "react";
import { ALL_AGENT_TYPES, SPECIALIZED_AGENT_TYPES } from "@/lib/agents/types";

const AGENT_LABELS: Record<string, string> = {
  "market-research": "Market Research",
  "marketing-content": "Marketing Content",
  "code-quality": "Code Quality",
  "ui-ux": "UI/UX Analysis",
  "dr-maya-knowledge": "Dr. Maya Knowledge",
  "master-coordinator": "Master Coordinator",
};

export function AgentTriggerPanel({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [runningAll, setRunningAll] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const runAll = async () => {
    setRunningAll(true);
    setProgress([]);

    for (const agentType of SPECIALIZED_AGENT_TYPES) {
      setProgress((p) => [...p, `Running ${AGENT_LABELS[agentType]}...`]);
      try {
        await fetch("/api/agents/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentType }),
        });
        setProgress((p) => [
          ...p,
          `${AGENT_LABELS[agentType]}: done`,
        ]);
      } catch {
        setProgress((p) => [
          ...p,
          `${AGENT_LABELS[agentType]}: failed`,
        ]);
      }
    }

    // Run coordinator
    setProgress((p) => [...p, "Running Master Coordinator..."]);
    try {
      await fetch("/api/agents/coordinate", {
        method: "POST",
      });
      setProgress((p) => [...p, "Master Coordinator: done"]);
    } catch {
      setProgress((p) => [...p, "Master Coordinator: failed"]);
    }

    setRunningAll(false);
    onComplete();
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h3 className="text-sm font-medium text-white/60">Run All Agents</h3>
      <p className="mt-1 text-[11px] text-white/25">
        Runs all 5 specialized agents sequentially, then the master coordinator.
      </p>

      <button
        onClick={runAll}
        disabled={runningAll}
        className="mt-4 w-full rounded-xl px-4 py-2.5 text-xs font-medium text-amber-200/70 transition-all duration-300 hover:text-amber-200/90 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: "rgba(196,149,106,0.1)",
          border: "1px solid rgba(196,149,106,0.15)",
        }}
      >
        {runningAll ? "Running..." : "Run Full Analysis"}
      </button>

      {progress.length > 0 && (
        <div className="mt-3 space-y-0.5 max-h-40 overflow-y-auto">
          {progress.map((msg, i) => (
            <p
              key={i}
              className={`text-[10px] ${
                msg.includes("done")
                  ? "text-emerald-400/50"
                  : msg.includes("failed")
                    ? "text-red-400/50"
                    : "text-white/25"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
