/* Shared animation variants for Framer Motion */

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" as const },
  },
};

export const fadeUpIndexed = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.0, ease: "easeOut" as const },
  },
};

export const messageFadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" as const },
  }),
};

/* ── Gamification animations ───────────────────────────── */

export const xpFloat = {
  initial: { opacity: 0, y: 10, scale: 0.8 },
  animate: {
    opacity: [0, 1, 1, 0],
    y: [10, 0, -10, -30],
    scale: [0.8, 1.2, 1, 0.8],
    transition: { duration: 1.5, ease: "easeOut" as const },
  },
};

export const levelUpPulse = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: [0.5, 1.2, 1],
    opacity: 1,
    transition: { duration: 0.6, type: "spring" as const, stiffness: 200 },
  },
};

export const badgeUnlock = {
  initial: { rotateY: 90, opacity: 0 },
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 150 },
  },
};

export const streakFlicker = {
  animate: {
    scale: [1, 1.1, 0.95, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};
