"use client";

import { motion, AnimatePresence } from "framer-motion";

export type ToastVariant = "default" | "success" | "error";

interface ToastProps {
  message: string | null;
  variant?: ToastVariant;
  onDismiss?: () => void;
}

const variantStyles: Record<ToastVariant, { border: string; text: string }> = {
  default: {
    border: "rgba(255,255,255,0.08)",
    text: "text-white/80",
  },
  success: {
    border: "rgba(74,222,128,0.15)",
    text: "text-emerald-300/90",
  },
  error: {
    border: "rgba(248,113,113,0.15)",
    text: "text-red-300/90",
  },
};

export function Toast({ message, variant = "default", onDismiss }: ToastProps) {
  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-xs font-light shadow-lg ${style.text}`}
          style={{
            background: "rgba(30,30,30,0.95)",
            border: `1px solid ${style.border}`,
            maxWidth: "90vw",
          }}
          onClick={onDismiss}
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
