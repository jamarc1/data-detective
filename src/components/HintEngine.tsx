"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MissionTask } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface HintEngineProps {
  task: MissionTask;
  onInsertAnswer?: (sql: string) => void;
}

const HINT_LABELS = ["Detective Hint", "Data Hint", "SQL Hint"];

export default function HintEngine({ task, onInsertAnswer }: HintEngineProps) {
  const tier = useGameStore((s) => s.hintTier[task.id] ?? 0);
  const advanceHint = useGameStore((s) => s.advanceHint);

  const hintText = [task.hints.detective, task.hints.data, task.hints.sql];

  function handleHint() {
    playSound("click");
    const next = Math.min(3, tier + 1);
    advanceHint(task.id);
    if (next === 3) onInsertAnswer?.(task.hints.sql);
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {tier > 0 && (
          <div className="mb-2 flex flex-col gap-2">
            {Array.from({ length: tier }).map((_, i) => (
              <motion.div
                key={HINT_LABELS[i]}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-md border border-accent/40 bg-accent/5 p-2"
              >
                <p className="mb-1 text-[11px] uppercase tracking-widest text-accent">
                  {HINT_LABELS[i]}
                </p>
                {i === 2 ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-accent-soft">
                    {hintText[i]}
                  </pre>
                ) : (
                  <p className="text-sm italic text-accent-soft">&ldquo;{hintText[i]}&rdquo;</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {tier < 3 ? (
        <button
          onClick={handleHint}
          className="self-start rounded border border-accent-soft/40 px-3 py-1.5 text-xs text-accent-soft transition hover:bg-accent-soft/10"
        >
          Need a Hint?
        </button>
      ) : (
        <p className="text-xs text-foreground/30">
          That&apos;s everything Marlowe&apos;s got on this one.
        </p>
      )}
    </div>
  );
}
