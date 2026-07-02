"use client";

import { motion } from "framer-motion";
import { useGameStore, levelFromXp, xpIntoLevel } from "@/store/gameStore";

export default function XPBar() {
  const xp = useGameStore((s) => s.xp);
  const level = levelFromXp(xp);
  const { current, needed, percent } = xpIntoLevel(xp);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent bg-accent/10 font-noir text-sm text-accent-soft">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex justify-between text-[11px] text-foreground/50">
          <span>Level {level}</span>
          <span>
            {current}/{needed} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
