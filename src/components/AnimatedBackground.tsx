"use client";

export default function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      style={{ background: "#080808" }}
    >
      {/* Warm amber — primary glow */}
      <div className="ambient-orb ambient-orb-1" />

      {/* Dusty rose — subtle accent */}
      <div className="ambient-orb ambient-orb-2" />

      {/* Sage green — subtle accent */}
      <div className="ambient-orb ambient-orb-3" />

      {/* Deep amber — secondary warmth */}
      <div className="ambient-orb ambient-orb-4" />

      {/* Center breathing glow */}
      <div className="ambient-glow" />

      {/* Vignette — darker edges for cinematic focus */}
      <div className="ambient-vignette" />
    </div>
  );
}
