"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BadgeUnlockToastProps {
  show: boolean;
  label: string;
  rarity: string;
}

export default function BadgeUnlockToast({ show, label, rarity }: BadgeUnlockToastProps) {
  const rarityColor =
    rarity === "legendary" ? "rgba(250,204,21,0.7)"
    : rarity === "rare" ? "rgba(52,211,153,0.6)"
    : rarity === "uncommon" ? "rgba(245,158,11,0.6)"
    : "rgba(148,163,184,0.5)";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, rotateY: 90 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-20 left-1/2 z-[75] -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3.5 backdrop-blur-xl shadow-lg"
            style={{
              background: "rgba(20,20,20,0.9)",
              border: `1px solid ${rarityColor}`,
              boxShadow: `0 0 25px ${rarityColor.replace(/[\d.]+\)$/, "0.1)")}`,
            }}
          >
            <span className="text-lg">
              {rarity === "legendary" ? "✨" : rarity === "rare" ? "💎" : rarity === "uncommon" ? "🔸" : "⚪"}
            </span>
            <div>
              <p className="text-xs font-light text-white/40">Badge Earned!</p>
              <p className="text-sm font-normal" style={{ color: rarityColor }}>
                {label}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
