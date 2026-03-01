"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[80] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-light text-white/70"
      style={{
        background: "rgba(30, 30, 30, 0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <WifiOff className="h-3.5 w-3.5 text-amber-300/50" />
      You&apos;re offline. Some features may not work.
    </div>
  );
}
