"use client";

interface LevelBadgeProps {
  level: number;
  title?: string;
  size?: "sm" | "md";
}

export default function LevelBadge({ level, title, size = "sm" }: LevelBadgeProps) {
  const isSmall = size === "sm";

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full ${isSmall ? "px-2.5 py-1" : "px-3 py-1.5"}`}
      style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.12)",
      }}
    >
      <span
        className={`font-normal ${isSmall ? "text-xs" : "text-sm"}`}
        style={{ color: "rgba(245,158,11,0.8)" }}
      >
        Lv.{level}
      </span>
      {title && (
        <span
          className={`font-light ${isSmall ? "text-xs" : "text-xs"} text-white/40`}
        >
          {title}
        </span>
      )}
    </div>
  );
}
