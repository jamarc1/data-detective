"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MISSIONS } from "@/lib/missions";
import { CLUE_CATALOG } from "@/lib/clues";
import { playSound } from "@/lib/sound";

interface InvestigationBoardProps {
  className?: string;
}

const HIGHLIGHT_MS = 3200;

export default function InvestigationBoard({ className = "" }: InvestigationBoardProps) {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const earnedClueIds = useGameStore((s) => s.earnedClueIds);
  const newlyUnlockedClueId = useGameStore((s) => s.newlyUnlockedClueId);
  const clearNewClue = useGameStore((s) => s.clearNewClue);

  const mission = MISSIONS.find((m) => m.id === currentMissionId) ?? MISSIONS[0];
  const clueIds = mission.tasks
    .map((t) => t.clueId)
    .filter((id): id is string => Boolean(id));

  // Start expanded if there's a clue to show off, collapsed otherwise.
  const [open, setOpen] = useState(() => Boolean(newlyUnlockedClueId));

  useEffect(() => {
    if (!newlyUnlockedClueId) return;
    playSound("badge");
    const timer = setTimeout(() => clearNewClue(), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [newlyUnlockedClueId, clearNewClue]);

  const earnedCount = clueIds.filter((id) => earnedClueIds.includes(id)).length;

  return (
    <div className={`noir-panel rounded-lg p-3 ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-1 text-left"
      >
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">
          Investigation Board
        </h2>
        <span className="text-[11px] text-foreground/40">
          {earnedCount}/{clueIds.length} · {open ? "Hide ▾" : "Show ▸"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-col gap-2 px-1 pb-1">
              {clueIds.map((id) => {
                const clue = CLUE_CATALOG[id];
                if (!clue) return null;
                const earned = earnedClueIds.includes(id);
                const isNew = newlyUnlockedClueId === id;

                return (
                  <motion.div
                    key={id}
                    initial={isNew ? { opacity: 0, scale: 0.92 } : false}
                    animate={
                      isNew
                        ? {
                            opacity: 1,
                            scale: [0.92, 1.04, 1],
                            boxShadow: [
                              "0 0 0px rgba(242,200,105,0)",
                              "0 0 16px rgba(242,200,105,0.55)",
                              "0 0 0px rgba(242,200,105,0)",
                            ],
                          }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`flex items-start gap-2 rounded-md border p-2 ${
                      earned
                        ? "border-accent/40 bg-accent/5"
                        : "border-panel-border bg-black/20 opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-lg leading-none">{earned ? clue.icon : "🔒"}</span>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          earned ? "text-accent-soft" : "text-foreground/50"
                        }`}
                      >
                        {earned ? clue.title : "Locked"}
                      </p>
                      <p className="text-[11px] leading-snug text-foreground/60">
                        {earned ? clue.description : "Crack the next lead to unlock this evidence."}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
