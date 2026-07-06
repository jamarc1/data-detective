"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    if (!newlyUnlockedClueId) return;
    playSound("badge");
    const timer = setTimeout(() => clearNewClue(), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [newlyUnlockedClueId, clearNewClue]);

  const earnedCount = clueIds.filter((id) => earnedClueIds.includes(id)).length;

  return (
    <div className={`noir-panel rounded-lg p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">
          Investigation Board
        </h2>
        <span className="font-mono text-[11px] text-foreground/40">
          {earnedCount}/{clueIds.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
              className={`relative flex flex-col rounded-lg border p-3 min-h-20 ${
                earned
                  ? "border-green-600/40 bg-green-600/10"
                  : "border-dashed border-panel-border/40 bg-black/30"
              }`}
            >
              {earned && (
                <div className="absolute top-2 right-2 text-green-400 font-noir text-xs">
                  ✓ FOUND
                </div>
              )}
              {!earned && (
                <div className="absolute top-2 right-2 text-foreground/40 font-noir text-xs">
                  🔒 LOCKED
                </div>
              )}

              <div className="pr-12">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    earned ? "text-green-300" : "text-foreground/40"
                  }`}
                >
                  {earned ? clue.title : "Locked Evidence"}
                </p>
                <p className="text-[11px] leading-snug text-foreground/60 mt-1">
                  {earned ? clue.description : "Crack the next lead to unlock."}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
