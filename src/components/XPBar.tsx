"use client";

import { motion } from "framer-motion";
import { useGameStore, levelFromXp, xpIntoLevel, getLevelTitle } from "@/store/gameStore";

export default function XPBar() {
  const xp = useGameStore((s) => s.xp);
  const level = levelFromXp(xp);
  const { current, needed, percent } = xpIntoLevel(xp);
  const levelTitle = getLevelTitle(level);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent bg-accent/10 font-noir text-sm text-accent-soft">
        {level}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex text-[11px] text-foreground/50">
          <span className="font-noir text-accent-soft">
            {current} / {needed} XP
          </span>
          <span className="mx-1.5 text-foreground/40">·</span>
          <span>{levelTitle}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={`Level ${level} progress: ${current} of ${needed} XP`}
          className="h-2 w-full overflow-hidden rounded-full bg-black/30"
        >
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
