"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MissionTask } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface HintEngineProps {
  task: MissionTask;
}

export default function HintEngine({ task }: HintEngineProps) {
  const hintsUsed = useGameStore((s) => s.hintsUsed[task.id] ?? 0);
  const revealHint = useGameStore((s) => s.revealHint);

  const revealed = task.hints.slice(0, hintsUsed);
  const hasMore = hintsUsed < task.hints.length;

  function handleReveal() {
    playSound("click");
    revealHint(task.id);
  }

  return (
    <div className="noir-panel rounded-lg p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">Hint Engine</h2>
        {hintsUsed > 0 && (
          <span className="text-[11px] text-foreground/40">{hintsUsed} used</span>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1">
        <AnimatePresence initial={false}>
          {revealed.map((hint, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-md border border-panel-border bg-black/20 px-3 py-2 text-sm text-foreground/70"
            >
              💡 {hint.text}
            </motion.p>
          ))}
        </AnimatePresence>

        {hasMore ? (
          <button
            onClick={handleReveal}
            className="self-start rounded border border-accent-soft/40 px-3 py-1.5 text-xs text-accent-soft transition hover:bg-accent-soft/10"
          >
            Need a hint? (−{task.hints[hintsUsed].xpPenalty} XP)
          </button>
        ) : (
          <p className="text-xs text-foreground/30">No more hints for this one.</p>
        )}
      </div>
    </div>
  );
}
