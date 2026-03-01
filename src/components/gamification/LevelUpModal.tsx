"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getLevelTitle } from "@/lib/gamification/levels";

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

function CelebrationParticles() {
  const particles = Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * 360;
    const distance = 80 + Math.random() * 120;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const size = 4 + Math.random() * 8;
    const delay = Math.random() * 0.4;
    const colors = [
      "rgba(250,204,21,0.8)",
      "rgba(245,158,11,0.7)",
      "rgba(196,149,106,0.6)",
      "rgba(74,222,128,0.5)",
      "rgba(255,255,255,0.4)",
    ];
    const color = colors[i % colors.length];

    return (
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{ width: size, height: size, background: color, top: "50%", left: "50%" }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{ x, y: y - 40, opacity: 0, scale: 0 }}
        transition={{ duration: 1 + Math.random() * 0.5, delay, ease: "easeOut" }}
      />
    );
  });

  return <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">{particles}</div>;
}

export default function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  const title = getLevelTitle(level);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex flex-col items-center text-center px-8 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <CelebrationParticles />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "2px solid rgba(245,158,11,0.3)",
                boxShadow: "0 0 60px rgba(245,158,11,0.15)",
              }}
            >
              <span
                className="text-4xl font-light"
                style={{ color: "rgba(245,158,11,0.8)" }}
              >
                {level}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-light tracking-wide text-white/90"
            >
              Level Up!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-lg font-light"
              style={{ color: "rgba(245,158,11,0.7)" }}
            >
              {title}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="mt-8 rounded-full px-8 py-3 text-sm font-normal tracking-wide text-amber-200/80 transition-all duration-500"
              style={{
                background: "rgba(196,149,106,0.12)",
                border: "1px solid rgba(196,149,106,0.2)",
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
