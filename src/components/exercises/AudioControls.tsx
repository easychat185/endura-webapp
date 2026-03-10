"use client";

import { Volume2, VolumeX } from "lucide-react";

interface AudioControlsProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function AudioControls({ enabled, onToggle }: AudioControlsProps) {
  return (
    <button
      onClick={onToggle}
      className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
      style={{
        background: enabled ? "rgba(196,149,106,0.1)" : "rgba(255,255,255,0.03)",
        border: enabled
          ? "1px solid rgba(196,149,106,0.15)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
      aria-label={enabled ? "Disable voice guidance" : "Enable voice guidance"}
      aria-pressed={enabled}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5 text-amber-200/70" />
      ) : (
        <VolumeX className="h-5 w-5 text-white/30" />
      )}
    </button>
  );
}
