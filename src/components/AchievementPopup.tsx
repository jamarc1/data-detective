"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

const DISPLAY_MS = 3200;

export default function AchievementPopup() {
  const achievementQueue = useGameStore((s) => s.achievementQueue);
  const popAchievement = useGameStore((s) => s.popAchievement);
  const current = achievementQueue[0];

  useEffect(() => {
    if (!current) return;
    playSound("badge");
    const timer = setTimeout(() => popAchievement(), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, popAchievement]);

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-50 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="noir-panel flex items-center gap-3 rounded-lg border-accent px-4 py-3 shadow-2xl"
          >
            <span className="text-2xl">{current.icon}</span>
            <div>
              <p className="font-noir text-xs uppercase tracking-widest text-accent">
                Achievement Unlocked
              </p>
              <p className="text-sm font-semibold text-accent-soft">{current.title}</p>
              <p className="text-xs text-foreground/60">{current.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
