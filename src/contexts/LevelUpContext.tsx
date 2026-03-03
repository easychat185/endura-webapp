"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { LEVEL_THRESHOLDS } from "@/lib/gamification/levels";
import { hapticLight } from "@/lib/capacitor";

interface LevelUpContextValue {
  triggerLevelUp: (level: number) => void;
}

const LevelUpContext = createContext<LevelUpContextValue | null>(null);

export function useLevelUp(): LevelUpContextValue {
  const ctx = useContext(LevelUpContext);
  if (!ctx) throw new Error("useLevelUp must be used within LevelUpProvider");
  return ctx;
}

export function LevelUpProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const [level, setLevel] = useState(1);
  const [isMilestone, setIsMilestone] = useState(false);

  const triggerLevelUp = useCallback((newLevel: number) => {
    const def = LEVEL_THRESHOLDS.find((l) => l.level === newLevel);
    setLevel(newLevel);
    setIsMilestone(def?.isMilestone ?? false);
    setShow(true);

    // Haptic feedback
    hapticLight();
    if (navigator.vibrate) {
      navigator.vibrate(def?.isMilestone ? [100, 50, 100, 50, 200] : [100, 50, 100]);
    }
  }, []);

  return (
    <LevelUpContext.Provider value={{ triggerLevelUp }}>
      {children}
      <LevelUpModal
        show={show}
        level={level}
        isMilestone={isMilestone}
        onClose={() => setShow(false)}
      />
    </LevelUpContext.Provider>
  );
}
