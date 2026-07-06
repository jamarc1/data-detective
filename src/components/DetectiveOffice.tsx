"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MISSIONS } from "@/lib/missions";
import ChiefDialogue from "./ChiefDialogue";
import { playSound } from "@/lib/sound";

const DUST_MOTES = Array.from({ length: 14 }, (_, i) => i);

export default function DetectiveOffice() {
  const startMission = useGameStore((s) => s.startMission);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const currentTaskIndex = useGameStore((s) => s.currentTaskIndex);
  const missionPhase = useGameStore((s) => s.missionPhase);
  const mission = MISSIONS[0];

  function handleComplete() {
    playSound("success");
    // Resume a saved case in progress instead of restarting it from Lead 1.
    // A finished case (or a fresh save) starts the mission from the top.
    if (currentTaskIndex > 0 && missionPhase !== "complete") {
      goToScreen("mission");
    } else {
      startMission(mission.id);
    }
  }

  return (
    <div className="film-grain relative flex min-h-screen w-full items-end justify-center overflow-hidden bg-gradient-to-b from-[#0c1220] via-[#0a0e18] to-[#05070d] px-4 pb-8 pt-16 sm:px-8">
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

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <p className="mb-3 text-center font-noir text-xs uppercase tracking-[0.3em] text-foreground/40">
          {mission.caseNumber} — Briefing
        </p>
        <ChiefDialogue
          lines={mission.briefing}
          onComplete={handleComplete}
          continueLabel="Head to the case files"
        />
      </motion.div>
    </div>
  );
}
