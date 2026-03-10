"use client";

import { useState, useRef, useEffect } from "react";
import { SPECIALIZED_AGENT_TYPES, AGENT_LABELS } from "@/lib/agents/types";
import type { AgentType } from "@/lib/agents/types";

interface ProgressEntry {
  agent: string;
  status: "running" | "done" | "failed";
}

const totalAgents = SPECIALIZED_AGENT_TYPES.length + 1; // +1 for coordinator

export function AgentTriggerPanel({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [runningAll, setRunningAll] = useState(false);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const runAll = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    setRunningAll(true);
    setProgress([]);
    setCurrentStep(0);

    let step = 0;
    for (const agentType of SPECIALIZED_AGENT_TYPES) {
      if (signal.aborted) break;
      step++;
      setCurrentStep(step);
      const label = AGENT_LABELS[agentType as AgentType];
      setProgress((p) => [...p, { agent: label, status: "running" }]);
      try {
        const res = await fetch("/api/agents/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentType }),
          signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setProgress((p) =>
          p.map((e) => (e.agent === label && e.status === "running" ? { ...e, status: "done" } : e))
        );
      } catch (err) {
        if (signal.aborted) break;
        setProgress((p) =>
          p.map((e) => (e.agent === label && e.status === "running" ? { ...e, status: "failed" } : e))
        );
      }
    }

    if (!signal.aborted) {
      // Run coordinator
      step++;
      setCurrentStep(step);
      const coordLabel = AGENT_LABELS["master-coordinator"];
      setProgress((p) => [...p, { agent: coordLabel, status: "running" }]);
      try {
        const res = await fetch("/api/agents/coordinate", { method: "POST", signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setProgress((p) =>
          p.map((e) => (e.agent === coordLabel && e.status === "running" ? { ...e, status: "done" } : e))
        );
      } catch (err) {
        if (!signal.aborted) {
          setProgress((p) =>
            p.map((e) => (e.agent === coordLabel && e.status === "running" ? { ...e, status: "failed" } : e))
          );
        }
      }
    }

    setRunningAll(false);
    setCurrentStep(0);
    if (!signal.aborted) onComplete();
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
      <p className="mt-1 text-[0.6875rem] text-white/50">
        Runs all 5 specialized agents sequentially, then the master coordinator.
      </p>

      <button
        onClick={runAll}
        disabled={runningAll}
        aria-busy={runningAll}
        aria-label={runningAll ? `Running agent ${currentStep} of ${totalAgents}` : "Run all agents"}
        className="mt-4 w-full rounded-xl px-4 py-2.5 text-xs font-medium text-amber-200/70 transition-all duration-300 hover:text-amber-200/90 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: "rgba(196,149,106,0.1)",
          border: "1px solid rgba(196,149,106,0.15)",
        }}
      >
        {runningAll ? `Running... (Agent ${currentStep} of ${totalAgents})` : "Run Full Analysis"}
      </button>

      {progress.length > 0 && (
        <div className="mt-3 space-y-0.5 max-h-40 overflow-y-auto" role="log" aria-live="polite">
          {progress.map((entry, i) => (
            <p
              key={i}
              className={`text-[0.625rem] ${
                entry.status === "done"
                  ? "text-emerald-400/50"
                  : entry.status === "failed"
                    ? "text-red-400/50"
                    : "text-white/50"
              }`}
            >
              {entry.agent}: {entry.status === "running" ? "running..." : entry.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
