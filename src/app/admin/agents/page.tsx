"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import { ALL_AGENT_TYPES } from "@/lib/agents/types";
import { AgentRunCard } from "./components/AgentRunCard";
import { TokenUsageChart } from "./components/TokenUsageChart";
import { MasterSummaryView } from "./components/MasterSummaryView";
import { ActionItemList } from "./components/ActionItemList";
import { ReportViewer } from "./components/ReportViewer";
import { AgentTriggerPanel } from "./components/AgentTriggerPanel";

interface DashboardData {
  latestRuns: Record<string, unknown>;
  totalRuns: number;
  actionItemsByStatus: Record<string, number>;
  costs: {
    sevenDay: number;
    thirtyDay: number;
    perAgent: Record<string, number>;
  };
  latestSummary: unknown;
}

export default function AgentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [reports, setReports] = useState<unknown[]>([]);
  const [actionItems, setActionItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    setError(null);

    try {
      // Cookie is sent automatically — no header needed
      const [dashRes, reportsRes, itemsRes] = await Promise.all([
        fetch("/api/agents/dashboard"),
        fetch("/api/agents/reports?limit=20"),
        fetch("/api/agents/action-items?limit=100"),
      ]);

      if (!dashRes.ok) {
        if (dashRes.status === 401) {
          setAuthenticated(false);
          throw new Error("Invalid admin secret");
        }
        throw new Error("Failed to load dashboard");
      }

      const [dashData, reportsData, itemsData] = await Promise.all([
        dashRes.json(),
        reportsRes.json(),
        itemsRes.json(),
      ]);

      setData(dashData);
      setReports(reportsData.reports ?? []);
      setActionItems(itemsData.actionItems ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Check if cookie already exists by trying a fetch
  useEffect(() => {
    fetch("/api/agents/dashboard").then((res) => {
      if (res.ok) setAuthenticated(true);
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretInput }),
      });
      if (!res.ok) {
        setError("Invalid admin secret");
        return;
      }
      setAuthenticated(true);
    } catch {
      setError("Failed to authenticate");
    }
  };

  const runAgent = async (agentType: string) => {
    setRunningAgents((prev) => new Set(prev).add(agentType));
    try {
      const endpoint =
        agentType === "master-coordinator"
          ? "/api/agents/coordinate"
          : "/api/agents/run";
      const body =
        agentType === "master-coordinator"
          ? undefined
          : JSON.stringify({ agentType });

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      await fetchData();
    } catch {
      // silently fail
    } finally {
      setRunningAgents((prev) => {
        const next = new Set(prev);
        next.delete(agentType);
        return next;
      });
    }
  };

  // Auth screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <form onSubmit={handleLogin} className="w-80 space-y-4">
          <h1 className="text-lg font-light text-white/70 text-center">
            Agent Dashboard
          </h1>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Admin secret"
            className="w-full rounded-xl px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.08] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-amber-400/30"
          />
          {error && (
            <p className="text-xs text-red-400/60 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-amber-200/70"
            style={{
              background: "rgba(196,149,106,0.1)",
              border: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  let sectionIdx = 0;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-lg font-light tracking-widest text-white/50">
            Agent Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/20">
              {data ? `${data.totalRuns} total runs` : ""}
            </span>
            <button
              onClick={fetchData}
              className="text-xs text-amber-200/50 hover:text-amber-200/70"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        key={loading ? "loading" : "loaded"}
        className="mx-auto max-w-5xl px-5 py-8 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.02)" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-red-400/60">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 rounded-full px-5 py-2.5 text-sm text-amber-200/70"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Token Usage */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <TokenUsageChart
                costPerAgent={data?.costs.perAgent ?? {}}
                cost7d={data?.costs.sevenDay ?? 0}
                cost30d={data?.costs.thirtyDay ?? 0}
              />
            </motion.section>

            {/* Agent Grid */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <h2 className="mb-3 text-[11px] font-medium text-white/30 uppercase tracking-[0.2em]">
                Agents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_AGENT_TYPES.map((agentType) => (
                  <AgentRunCard
                    key={agentType}
                    agentType={agentType}
                    run={
                      (data?.latestRuns[agentType] as Record<
                        string,
                        unknown
                      >) as never
                    }
                    onRunNow={() => runAgent(agentType)}
                    isRunning={runningAgents.has(agentType)}
                  />
                ))}
              </div>
            </motion.section>

            {/* Run All Panel */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <AgentTriggerPanel
                onComplete={fetchData}
              />
            </motion.section>

            {/* Master Summary */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <MasterSummaryView
                summary={data?.latestSummary as never}
              />
            </motion.section>

            {/* Action Items */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <ActionItemList
                items={actionItems as never[]}
                onUpdate={fetchData}
              />
            </motion.section>

            {/* Reports */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed}>
              <ReportViewer
                reports={reports as never[]}
              />
            </motion.section>
          </div>
        )}
      </motion.main>
    </div>
  );
}
