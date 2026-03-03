"use client";

import { useState } from "react";

interface ActionItem {
  id: string;
  agent_type: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  category: string;
  created_at: string;
}

const STATUS_TABS = ["open", "in_progress", "completed", "dismissed"] as const;

export function ActionItemList({
  items,
  onUpdate,
  onError,
}: {
  items: ActionItem[];
  onUpdate: () => void;
  onError?: (message: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>("open");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = items.filter((item) => item.status === activeTab);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/agents/action-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Update failed (${res.status})`);
      }
      onUpdate();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update action item.";
      if (onError) onError(msg);
      else console.error(msg);
    } finally {
      setUpdating(null);
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
      <h3 className="text-sm font-medium text-white/60">Action Items</h3>

      {/* Tabs */}
      <div className="mt-3 flex gap-1">
        {STATUS_TABS.map((tab) => {
          const count = items.filter((i) => i.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-2.5 min-h-[44px] text-[11px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-white/[0.08] text-white/70"
                  : "text-white/50 hover:text-white/60"
              }`}
            >
              {tab.replace("_", " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-white/40 py-4 text-center">
            No {activeTab.replace("_", " ")} items
          </p>
        )}

        {[...filtered]
          .sort((a, b) => b.priority - a.priority)
          .map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                      style={{
                        background:
                          item.priority >= 8
                            ? "rgba(239,68,68,0.15)"
                            : item.priority >= 5
                              ? "rgba(250,204,21,0.15)"
                              : "rgba(148,163,184,0.15)",
                        color:
                          item.priority >= 8
                            ? "rgba(248,113,113,0.8)"
                            : item.priority >= 5
                              ? "rgba(250,204,21,0.8)"
                              : "rgba(148,163,184,0.8)",
                      }}
                    >
                      {item.priority}
                    </span>
                    <p className="text-xs text-white/60 truncate">
                      {item.title}
                    </p>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-[11px] text-white/45 line-clamp-2 pl-7">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-1 flex gap-2 pl-7">
                    <span className="text-[10px] text-white/40">
                      {item.agent_type}
                    </span>
                    {item.category && (
                      <span className="text-[10px] text-white/40">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  {activeTab === "open" && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, "completed")}
                        disabled={updating === item.id}
                        className="rounded px-3 py-2 min-h-[44px] text-xs text-emerald-400/60 hover:bg-emerald-400/10 disabled:opacity-30"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "dismissed")}
                        disabled={updating === item.id}
                        className="rounded px-3 py-2 min-h-[44px] text-xs text-white/45 hover:bg-white/[0.05] disabled:opacity-30"
                      >
                        Skip
                      </button>
                    </>
                  )}
                  {activeTab === "in_progress" && (
                    <button
                      onClick={() => updateStatus(item.id, "completed")}
                      disabled={updating === item.id}
                      className="rounded px-3 py-2 min-h-[44px] text-xs text-emerald-400/60 hover:bg-emerald-400/10 disabled:opacity-30"
                    >
                      Done
                    </button>
                  )}
                  {(activeTab === "completed" || activeTab === "dismissed") && (
                    <button
                      onClick={() => updateStatus(item.id, "open")}
                      disabled={updating === item.id}
                      className="rounded px-3 py-2 min-h-[44px] text-xs text-white/45 hover:bg-white/[0.05] disabled:opacity-30"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
