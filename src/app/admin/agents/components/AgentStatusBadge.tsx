"use client";

export function AgentStatusBadge({ status }: { status: string | null }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: {
      bg: "rgba(74,222,128,0.1)",
      text: "text-emerald-400",
      label: "Completed",
    },
    running: {
      bg: "rgba(250,204,21,0.1)",
      text: "text-yellow-400",
      label: "Running",
    },
    failed: {
      bg: "rgba(248,113,113,0.1)",
      text: "text-red-400",
      label: "Failed",
    },
    pending: {
      bg: "rgba(148,163,184,0.1)",
      text: "text-slate-400",
      label: "Pending",
    },
  };

  const c = config[status ?? ""] ?? {
    bg: "rgba(148,163,184,0.1)",
    text: "text-slate-400/50",
    label: "Never Run",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${c.text}`}
      style={{ background: c.bg }}
    >
      {c.label}
    </span>
  );
}
