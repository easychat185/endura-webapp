"use client";

import { motion, AnimatePresence } from "framer-motion";

interface XPGainToastProps {
  show: boolean;
  amount: number;
  multiplier?: number;
}

export default function XPGainToast({ show, amount, multiplier }: XPGainToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-6 left-1/2 z-[70] -translate-x-1/2"
        >
          <div
            className="flex items-center gap-2 rounded-2xl px-5 py-3 backdrop-blur-xl shadow-lg"
            style={{
              background: "rgba(20,20,20,0.9)",
              border: "1px solid rgba(250,204,21,0.15)",
              boxShadow: "0 0 30px rgba(250,204,21,0.08)",
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg"
              style={{ color: "rgba(250,204,21,0.8)" }}
            >
              +{amount} XP
            </motion.span>
            {multiplier && multiplier > 1 && (
              <span
                className="text-xs font-light rounded-full px-2 py-0.5"
                style={{
                  background: "rgba(251,146,60,0.1)",
                  color: "rgba(251,146,60,0.7)",
                }}
              >
                {multiplier}x
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
