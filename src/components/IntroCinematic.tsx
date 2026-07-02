"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

const STORY_LINES = [
  "City records show fourteen unsolved cases this year alone.",
  "The department's newest weapon isn't a badge or a gun — it's a query.",
  "Every clue lives in a database. Every alibi can be checked in a WHERE clause.",
  "You've just been assigned to the Data Desk.",
];

export default function IntroCinematic() {
  const goToScreen = useGameStore((s) => s.goToScreen);
  const [lineIndex, setLineIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

  const isLastLine = lineIndex >= STORY_LINES.length;

  function handleAdvance() {
    playSound("pageTurn");
    if (showTitle) {
      setShowTitle(false);
      return;
    }
    if (lineIndex < STORY_LINES.length) {
      setLineIndex((i) => i + 1);
    }
  }

  function handleBegin() {
    playSound("click");
    goToScreen("office");
  }

  return (
    <div
      className="film-grain relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#05070d] px-6 text-center"
      onClick={!isLastLine ? handleAdvance : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,164,65,0.12),transparent_60%)]" />

      <AnimatePresence mode="wait">
        {showTitle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <p className="mb-4 tracking-[0.4em] text-accent-soft/70 text-sm">CASE FILE OPEN</p>
            <h1 className="font-noir text-6xl sm:text-7xl md:text-8xl text-accent-soft drop-shadow-[0_0_25px_rgba(242,200,105,0.35)]">
              DATA DETECTIVE
            </h1>
            <p className="mt-6 font-noir text-lg text-foreground/70">
              a narrative SQL mystery
            </p>
            <motion.p
              className="mt-12 text-xs uppercase tracking-widest text-foreground/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              click anywhere to continue
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={`line-${lineIndex}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl"
          >
            {!isLastLine ? (
              <>
                <p className="font-noir text-2xl sm:text-3xl leading-relaxed text-foreground/90">
                  {STORY_LINES[lineIndex]}
                </p>
                <p className="mt-10 text-xs uppercase tracking-widest text-foreground/40">
                  click to continue ({lineIndex + 1}/{STORY_LINES.length})
                </p>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleBegin}
                className="rounded-md border-2 border-accent bg-accent/10 px-8 py-4 font-noir text-xl text-accent-soft transition hover:bg-accent/20"
              >
                Begin Investigation
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
