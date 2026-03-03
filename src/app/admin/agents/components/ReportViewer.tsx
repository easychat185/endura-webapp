"use client";

import { useState, useMemo, useRef } from "react";
import { AGENT_LABELS } from "@/lib/agents/types";

interface Report {
  id: string;
  agent_type: string;
  summary: string;
  report: Record<string, unknown>;
  created_at: string;
}

// Recursively render any JSON value as readable UI
function RenderValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) {
    return <span className="text-white/40 italic">—</span>;
  }

  if (typeof value === "string") {
    // Multi-line strings
    if (value.includes("\n")) {
      return (
        <p className="text-xs text-white/40 leading-relaxed whitespace-pre-line">
          {value}
        </p>
      );
    }
    return <span className="text-xs text-white/40">{value}</span>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <span className="text-xs text-amber-200/50 font-medium">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-white/40 italic text-xs">empty</span>;

    // Array of strings — render as bullet list
    if (value.every((v) => typeof v === "string")) {
      return (
        <ul className="space-y-1 pl-1">
          {value.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-white/40">
              <span className="text-white/40 shrink-0">-</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Array of objects — render as cards
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="rounded-lg p-3"
            style={{
              background: depth < 2 ? "rgba(255,255,255,0.015)" : "transparent",
              border: depth < 2 ? "1px solid rgba(255,255,255,0.025)" : "none",
            }}
          >
            <RenderValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div className={depth > 0 ? "space-y-2" : "space-y-3"}>
        {entries.map(([key, val]) => {
          const label = formatKey(key);

          // Simple value — render inline
          if (typeof val === "string" && !val.includes("\n") && val.length < 120) {
            return (
              <div key={key} className="flex gap-2 items-baseline flex-wrap">
                <span className="text-[11px] font-medium text-white/50 shrink-0 min-w-[80px]">
                  {label}:
                </span>
                <RenderValue value={val} depth={depth + 1} />
              </div>
            );
          }

          if (typeof val === "number" || typeof val === "boolean") {
            return (
              <div key={key} className="flex gap-2 items-baseline">
                <span className="text-[11px] font-medium text-white/50 shrink-0 min-w-[80px]">
                  {label}:
                </span>
                <RenderValue value={val} depth={depth + 1} />
              </div>
            );
          }

          // Complex value — render as block
          return (
            <div key={key}>
              <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
                {label}
              </p>
              <div className="pl-2 border-l border-white/[0.04]">
                <RenderValue value={val} depth={depth + 1} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-xs text-white/50">{String(value)}</span>;
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export function ReportViewer({
  reports,
}: {
  reports: Report[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fullReport, setFullReport] = useState<Record<string, unknown> | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const requestIdRef = useRef(0);

  const grouped = useMemo(
    () =>
      reports.reduce(
        (acc, r) => {
          const key = r.agent_type;
          if (!acc[key]) acc[key] = [];
          acc[key].push(r);
          return acc;
        },
        {} as Record<string, Report[]>
      ),
    [reports]
  );

  const loadFullReport = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setFullReport(null);
      return;
    }

    setExpandedId(id);
    setFullReport(null);
    setLoadingReport(true);

    const currentRequestId = ++requestIdRef.current;

    try {
      const res = await fetch(`/api/agents/reports/${id}`);
      // Discard stale response if another request was started
      if (requestIdRef.current !== currentRequestId) return;
      if (!res.ok) {
        console.error("Report fetch failed:", res.status, res.statusText);
        setFullReport(null);
        return;
      }
      const data = await res.json();
      if (requestIdRef.current !== currentRequestId) return;
      setFullReport(data.report?.report ?? null);
    } catch (err) {
      if (requestIdRef.current !== currentRequestId) return;
      console.error("Report fetch error:", err);
      setFullReport(null);
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoadingReport(false);
      }
    }
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h3 className="text-sm font-medium text-white/60">Recent Reports</h3>

      <div className="mt-4 space-y-4">
        {Object.entries(grouped).map(([agentType, agentReports]) => (
          <div key={agentType}>
            <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
              {AGENT_LABELS[agentType as keyof typeof AGENT_LABELS] ?? agentType}
            </h4>

            <div className="space-y-1.5">
              {agentReports.map((report) => (
                <div key={report.id}>
                  <button
                    onClick={() => loadFullReport(report.id)}
                    className="w-full text-left rounded-xl p-3 transition-all hover:bg-white/[0.02]"
                    style={{ border: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {new Date(report.created_at).toLocaleDateString()}{" "}
                        {new Date(report.created_at).toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {expandedId === report.id ? "Collapse" : "Expand"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/50 line-clamp-2">
                      {report.summary}
                    </p>
                  </button>

                  {expandedId === report.id && (
                    <div
                      className="mt-1 rounded-xl p-4 max-h-[500px] overflow-y-auto"
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      {loadingReport ? (
                        <p className="text-[11px] text-white/40">Loading report...</p>
                      ) : fullReport ? (
                        <RenderValue value={fullReport} />
                      ) : (
                        <p className="text-[11px] text-white/40">
                          Could not load report.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <p className="text-xs text-white/40 py-4 text-center">
            No reports yet. Run an agent to generate one.
          </p>
        )}
      </div>
    </div>
  );
}
