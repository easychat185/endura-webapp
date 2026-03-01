"use client";

import { useReducer } from "react";

interface DailySummary {
  id: string;
  summary_date: string;
  executive_summary: string;
  cross_cutting_patterns: { pattern: string; agents: string[]; implication: string }[] | string[];
  top_priorities: { rank?: number; title: string; description: string; effort: string; impact: string; category?: string }[];
  conflicts: { agents: string[]; issue: string; resolution: string }[] | string[];
  gaps: { area: string; description: string; recommendation: string }[] | string[];
  strategic_recommendations: { title: string; description: string; timeframe: string; expectedImpact?: string }[] | string[];
}

export function MasterSummaryView({
  summary,
}: {
  summary: DailySummary | null;
}) {
  // useReducer instead of useState to guarantee re-render
  const [expanded, toggleExpanded] = useReducer((s: boolean) => !s, false);

  if (!summary) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3 className="text-sm font-medium text-white/60">Master Summary</h3>
        <p className="mt-2 text-xs text-white/25">
          No summary yet. Run the master coordinator to generate one.
        </p>
      </div>
    );
  }

  const patterns = Array.isArray(summary.cross_cutting_patterns)
    ? summary.cross_cutting_patterns
    : [];
  const priorities = Array.isArray(summary.top_priorities)
    ? summary.top_priorities
    : [];
  const conflicts = Array.isArray(summary.conflicts)
    ? summary.conflicts
    : [];
  const gaps = Array.isArray(summary.gaps)
    ? summary.gaps
    : [];
  const recommendations = Array.isArray(summary.strategic_recommendations)
    ? summary.strategic_recommendations
    : [];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(196,149,106,0.03)",
        border: "1px solid rgba(196,149,106,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-amber-200/60">
          Master Summary — {summary.summary_date}
        </h3>
        <button
          type="button"
          onClick={toggleExpanded}
          className="rounded-lg px-3 py-1 text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"
        >
          {expanded ? "Collapse" : "Expand All"}
        </button>
      </div>

      {/* Executive Summary — always visible */}
      <div className="mt-4">
        <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-2">
          Executive Summary
        </h4>
        <p className="text-xs text-white/45 leading-relaxed whitespace-pre-line">
          {summary.executive_summary}
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-6 space-y-6">

          {/* Top Priorities */}
          {priorities.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-3">
                Top Priorities
              </h4>
              <div className="space-y-2">
                {priorities.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.025)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold shrink-0"
                        style={{
                          background: "rgba(196,149,106,0.1)",
                          color: "rgba(196,149,106,0.7)",
                        }}
                      >
                        {p.rank ?? i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/55">{p.title}</p>
                        <p className="mt-1 text-[11px] text-white/30 leading-relaxed">
                          {p.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.effort && (
                            <span className="rounded px-2 py-0.5 text-[10px] text-white/25" style={{ background: "rgba(255,255,255,0.03)" }}>
                              Effort: {p.effort}
                            </span>
                          )}
                          {p.impact && (
                            <span className="rounded px-2 py-0.5 text-[10px] text-white/25" style={{ background: "rgba(255,255,255,0.03)" }}>
                              Impact: {p.impact}
                            </span>
                          )}
                          {p.category && (
                            <span className="rounded px-2 py-0.5 text-[10px] text-white/25" style={{ background: "rgba(255,255,255,0.03)" }}>
                              {p.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross-Cutting Patterns */}
          {patterns.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-3">
                Cross-Cutting Patterns
              </h4>
              <div className="space-y-2">
                {patterns.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.025)",
                    }}
                  >
                    {typeof p === "string" ? (
                      <p className="text-xs text-white/40">{p}</p>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-white/50">{p.pattern}</p>
                        {p.implication && (
                          <p className="mt-1 text-[11px] text-white/25">{p.implication}</p>
                        )}
                        {p.agents?.length > 0 && (
                          <div className="mt-1.5 flex gap-1.5">
                            {p.agents.map((a, j) => (
                              <span key={j} className="rounded px-1.5 py-0.5 text-[9px] text-white/20" style={{ background: "rgba(255,255,255,0.03)" }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-3">
                Strategic Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.025)",
                    }}
                  >
                    {typeof r === "string" ? (
                      <p className="text-xs text-white/40">{r}</p>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-white/50">{r.title}</p>
                          {r.timeframe && (
                            <span
                              className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                              style={{
                                background:
                                  r.timeframe === "immediate"
                                    ? "rgba(239,68,68,0.1)"
                                    : r.timeframe === "short-term"
                                      ? "rgba(250,204,21,0.1)"
                                      : "rgba(59,130,246,0.1)",
                                color:
                                  r.timeframe === "immediate"
                                    ? "rgba(248,113,113,0.7)"
                                    : r.timeframe === "short-term"
                                      ? "rgba(250,204,21,0.7)"
                                      : "rgba(96,165,250,0.7)",
                              }}
                            >
                              {r.timeframe}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-white/30 leading-relaxed">
                          {r.description}
                        </p>
                        {r.expectedImpact && (
                          <p className="mt-1 text-[10px] text-emerald-400/30">
                            Expected: {r.expectedImpact}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-3">
                Conflicts Between Agents
              </h4>
              <div className="space-y-2">
                {conflicts.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(239,68,68,0.02)",
                      border: "1px solid rgba(239,68,68,0.06)",
                    }}
                  >
                    {typeof c === "string" ? (
                      <p className="text-xs text-white/40">{c}</p>
                    ) : (
                      <>
                        <p className="text-xs text-red-300/50">{c.issue}</p>
                        <p className="mt-1 text-[11px] text-white/25">
                          Resolution: {c.resolution}
                        </p>
                        {c.agents?.length > 0 && (
                          <p className="mt-1 text-[10px] text-white/15">
                            Agents: {c.agents.join(", ")}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {gaps.length > 0 && (
            <div>
              <h4 className="text-[11px] font-medium text-amber-200/30 uppercase tracking-wider mb-3">
                Identified Gaps
              </h4>
              <div className="space-y-2">
                {gaps.map((g, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(250,204,21,0.02)",
                      border: "1px solid rgba(250,204,21,0.06)",
                    }}
                  >
                    {typeof g === "string" ? (
                      <p className="text-xs text-white/40">{g}</p>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-yellow-300/50">{g.area}</p>
                        <p className="mt-1 text-[11px] text-white/30">{g.description}</p>
                        <p className="mt-1 text-[11px] text-white/20">
                          Rec: {g.recommendation}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
