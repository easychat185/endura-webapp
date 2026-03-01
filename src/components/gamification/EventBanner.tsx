"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface XPEvent {
  id: string;
  title: string;
  description: string;
  multiplier: number;
  ends_at: string;
}

interface EventBannerProps {
  event: XPEvent;
}

export default function EventBanner({ event }: EventBannerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const end = new Date(event.ends_at).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${mins}m`);
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [event.ends_at]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-5 py-4 overflow-hidden relative"
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.12)",
      }}
    >
      {/* Pulse animation background */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(245,158,11,0.03)" }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "rgba(245,158,11,0.1)" }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "rgba(245,158,11,0.6)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-normal" style={{ color: "rgba(245,158,11,0.7)" }}>
              {event.title}
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-normal"
              style={{
                background: "rgba(245,158,11,0.1)",
                color: "rgba(245,158,11,0.7)",
              }}
            >
              {event.multiplier}x XP
            </span>
          </div>
          <p className="text-xs font-light text-white/40 mt-0.5">
            {event.description} &middot; {timeLeft} remaining
          </p>
        </div>
      </div>
    </motion.div>
  );
}
