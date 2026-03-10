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

interface DashboardData {
  latestRuns: Record<string, AgentRun | null>;
  totalRuns: number;
  actionItemsByStatus: Record<string, number>;
  costs: {
    sevenDay: number;
    thirtyDay: number;
    perAgent: Record<string, number>;
  };
  latestSummary: {
    id: string;
    summary_date: string;
    executive_summary: string;
    cross_cutting_patterns: { pattern: string; agents: string[]; implication: string }[] | string[];
    top_priorities: { rank?: number; title: string; description: string; effort: string; impact: string; category?: string }[];
    conflicts: { agents: string[]; issue: string; resolution: string }[] | string[];
    gaps: { area: string; description: string; recommendation: string }[] | string[];
    strategic_recommendations: { title: string; description: string; timeframe: string; expectedImpact?: string }[] | string[];
  } | null;
}

export default function AgentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [reports, setReports] = useState<{ id: string; agent_type: string; summary: string; report: Record<string, unknown>; created_at: string }[]>([]);
  const [actionItems, setActionItems] = useState<{ id: string; agent_type: string; title: string; description: string; priority: number; status: string; category: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

      if (!reportsRes.ok) throw new Error("Failed to load reports");
      if (!itemsRes.ok) throw new Error("Failed to load action items");

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

  // Check if cookie already exists; if so, skip the second fetch by loading data directly
  const [probed, setProbed] = useState(false);

  useEffect(() => {
    fetch("/api/agents/dashboard")
      .then(async (res) => {
        if (res.ok) {
          // Cookie is valid — use the response data directly
          const dashData = await res.json();
          setAuthenticated(true);
          setData(dashData);

          // Fetch reports and action items in parallel
          const [reportsRes, itemsRes] = await Promise.all([
            fetch("/api/agents/reports?limit=20"),
            fetch("/api/agents/action-items?limit=100"),
          ]);
          if (reportsRes.ok) {
            const reportsData = await reportsRes.json();
            setReports(reportsData.reports ?? []);
          }
          if (itemsRes.ok) {
            const itemsData = await itemsRes.json();
            setActionItems(itemsData.actionItems ?? []);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false))
      .finally(() => setProbed(true));
  }, []);

  useEffect(() => {
    // Only auto-fetch after login, not on initial probe (probe already loaded data)
    if (authenticated && probed && !data) {
      fetchData();
    }
  }, [authenticated, fetchData, probed, data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
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
    } finally {
      setIsLoggingIn(false);
    }
  };

  const runAgent = async (agentType: string) => {
    setRunningAgents((prev) => new Set(prev).add(agentType));
    try {
      const isCoordinator = agentType === "master-coordinator";
      const endpoint = isCoordinator
        ? "/api/agents/coordinate"
        : "/api/agents/run";

      const res = await fetch(endpoint, {
        method: "POST",
        ...(isCoordinator
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ agentType }),
            }),
      });

      if (!res.ok) throw new Error("Agent run failed");

      await fetchData();
    } catch {
      const label = agentType === "master-coordinator" ? "Master Coordinator" : agentType;
      setError(`Failed to run ${label}. Please try again.`);
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
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
            className="w-full rounded-xl px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.08] text-white/70 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080808] focus:border-amber-400/60"
          />
          {error && (
            <p id="login-error" role="alert" className="text-xs text-red-400/60 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-amber-200/70 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(196,149,106,0.1)",
              border: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  const sections = [
    <TokenUsageChart
      key="token-usage"
      costPerAgent={data?.costs.perAgent ?? {}}
      cost7d={data?.costs.sevenDay ?? 0}
      cost30d={data?.costs.thirtyDay ?? 0}
    />,
    <div key="agent-grid">
      <h2 className="mb-3 text-[0.6875rem] font-medium text-white/50 uppercase tracking-[0.2em]">
        Agents
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_AGENT_TYPES.map((agentType) => (
          <AgentRunCard
            key={agentType}
            agentType={agentType}
            run={data?.latestRuns[agentType] ?? null}
            onRunNow={() => runAgent(agentType)}
            isRunning={runningAgents.has(agentType)}
          />
        ))}
      </div>
    </div>,
    <AgentTriggerPanel key="trigger-panel" onComplete={fetchData} />,
    <MasterSummaryView key="summary" summary={data?.latestSummary ?? null} />,
    <ActionItemList key="action-items" items={actionItems} onUpdate={fetchData} />,
    <ReportViewer key="reports" reports={reports} />,
  ];

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
            <span className="text-xs text-white/50">
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
            {sections.map((section, idx) => (
              <motion.section key={idx} custom={idx} variants={fadeUpIndexed}>
                {section}
              </motion.section>
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}
