"use client";

const AGENT_COLORS: Record<string, string> = {
  "market-research": "rgba(59,130,246,0.6)",
  "marketing-content": "rgba(168,85,247,0.6)",
  "code-quality": "rgba(239,68,68,0.6)",
  "ui-ux": "rgba(34,197,94,0.6)",
  "dr-maya-knowledge": "rgba(250,204,21,0.6)",
  "master-coordinator": "rgba(196,149,106,0.6)",
};

const AGENT_LABELS: Record<string, string> = {
  "market-research": "Market",
  "marketing-content": "Marketing",
  "code-quality": "Code",
  "ui-ux": "UI/UX",
  "dr-maya-knowledge": "Dr. Maya",
  "master-coordinator": "Coord.",
};

export function TokenUsageChart({
  costPerAgent,
  cost7d,
  cost30d,
}: {
  costPerAgent: Record<string, number>;
  cost7d: number;
  cost30d: number;
}) {
  const maxCost = Math.max(...Object.values(costPerAgent), 0.001);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <h3 className="text-sm font-medium text-white/60">Token Usage & Costs</h3>

      <div className="mt-3 flex gap-6 text-xs text-white/35">
        <span>7d: <span className="text-white/60">${cost7d.toFixed(4)}</span></span>
        <span>30d: <span className="text-white/60">${cost30d.toFixed(4)}</span></span>
      </div>

      {/* Bar chart */}
      <div className="mt-5 space-y-2.5">
        {Object.entries(costPerAgent).map(([agent, cost]) => (
          <div key={agent} className="flex items-center gap-3">
            <span className="w-16 text-[10px] text-white/30 text-right">
              {AGENT_LABELS[agent] ?? agent}
            </span>
            <div className="flex-1 h-4 rounded bg-white/[0.03] overflow-hidden">
              <div
                className="h-full rounded transition-all duration-700"
                style={{
                  width: `${Math.max((cost / maxCost) * 100, cost > 0 ? 2 : 0)}%`,
                  background: AGENT_COLORS[agent] ?? "rgba(255,255,255,0.3)",
                }}
              />
            </div>
            <span className="w-14 text-[10px] text-white/25 text-right">
              ${cost.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
