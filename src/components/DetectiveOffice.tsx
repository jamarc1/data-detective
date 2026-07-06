"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MISSIONS } from "@/lib/missions";
import { playSound } from "@/lib/sound";

const DUST_MOTES = Array.from({ length: 14 }, (_, i) => i);

export default function DetectiveOffice() {
  const startMission = useGameStore((s) => s.startMission);
  const completedMissionIds = useGameStore((s) => s.completedMissionIds);

  function getSkillTags(missionIndex: number): string[] {
    const mission = MISSIONS[missionIndex];
    const concepts = new Set(mission.tasks.map((t) => t.concept));
    return Array.from(concepts);
  }

  function getDifficultyColor(difficulty?: string): string {
    switch (difficulty) {
      case "beginner":
        return "bg-green-900/20 text-green-300 border-green-700/30";
      case "intermediate":
        return "bg-yellow-900/20 text-yellow-300 border-yellow-700/30";
      case "advanced":
        return "bg-red-900/20 text-red-300 border-red-700/30";
      default:
        return "bg-blue-900/20 text-blue-300 border-blue-700/30";
    }
  }

  function handleCaseClick(missionId: string, missionIndex: number, isLocked: boolean) {
    if (isLocked) {
      playSound("error");
      return;
    }
    playSound("click");
    startMission(missionId);
  }

  return (
    <div className="film-grain relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0c1220] via-[#0a0e18] to-[#05070d] px-4 pb-12 pt-20 sm:px-8">
      {/* window with venetian blind light stripes */}
      <div className="pointer-events-none absolute right-6 top-8 h-64 w-44 overflow-hidden rounded-sm border border-[#2a3654]/60 opacity-70 sm:right-16 sm:h-80 sm:w-56">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a3f2a] via-[#1a1f2e] to-[#0a0e18]" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-2 bg-black/40"
            style={{ top: `${i * 10}%` }}
          />
        ))}
        <motion.div
          className="absolute inset-0 bg-accent-soft/10"
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* neon sign glow */}
      <motion.p
        className="absolute right-8 top-2 font-noir text-xs tracking-widest text-accent-soft/60 sm:right-20"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        DATA DESK — 24HR
      </motion.p>

      {/* drifting dust motes */}
      {DUST_MOTES.map((i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-accent-soft/30"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* desk lamp glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      {/* Case Selection Screen */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <p className="mb-8 text-center font-noir text-xs uppercase tracking-[0.3em] text-foreground/40">
          Case Files — Available Investigations
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {MISSIONS.map((mission, index) => {
            const isCompleted = completedMissionIds.includes(mission.id);
            const previousMissionCompleted =
              index === 0 || completedMissionIds.includes(MISSIONS[index - 1].id);
            const isLocked = !previousMissionCompleted;
            const skillTags = getSkillTags(index);

            return (
              <motion.button
                key={mission.id}
                onClick={() => handleCaseClick(mission.id, index, isLocked)}
                disabled={isLocked}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative overflow-hidden rounded-lg border text-left transition-all ${
                  isLocked
                    ? "cursor-not-allowed border-foreground/20 bg-foreground/5 opacity-50"
                    : "border-accent/40 bg-gradient-to-br from-foreground/10 to-foreground/5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20"
                }`}
              >
                {/* Card glow effect */}
                {!isLocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative p-6">
                  {/* Case Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="font-noir text-xs uppercase tracking-[0.2em] text-accent-soft/60">
                        {mission.caseNumber}
                      </p>
                      <h3 className="mt-2 font-serif text-lg font-bold text-foreground">
                        {mission.title}
                      </h3>
                    </div>
                    {isLocked && <span className="text-2xl">🔒</span>}
                    {isCompleted && <span className="text-2xl">✓</span>}
                  </div>

                  {/* Difficulty Badge */}
                  {mission.difficulty && (
                    <div className="mb-4">
                      <span
                        className={`inline-block rounded border px-3 py-1 font-noir text-xs uppercase tracking-wider ${getDifficultyColor(
                          mission.difficulty
                        )}`}
                      >
                        {mission.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Skill Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {skillTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-accent/30 bg-accent/10 px-2 py-1 font-noir text-xs text-accent/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status Message */}
                  {isLocked && index > 0 && (
                    <p className="text-sm text-foreground/60">
                      Complete {MISSIONS[index - 1].title} to unlock.
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-sm text-accent/60">Case solved — available for replay.</p>
                  )}
                  {!isLocked && !isCompleted && (
                    <p className="text-sm text-foreground/60">Click to begin investigation.</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
