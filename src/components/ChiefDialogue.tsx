"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useKeyedState } from "@/hooks/useKeyedState";
import { playSound } from "@/lib/sound";

interface ChiefDialogueProps {
  lines: string[];
  onComplete: () => void;
  continueLabel?: string;
}

const TYPE_SPEED_MS = 16;

export default function ChiefDialogue({ lines, onComplete, continueLabel = "Continue" }: ChiefDialogueProps) {
  const linesKey = lines.join("|");
  const [lineIndex, setLineIndex] = useKeyedState(linesKey, () => 0);

  const currentLine = lines[lineIndex] ?? "";
  const isLastLine = lineIndex === lines.length - 1;
  const stepKey = `${linesKey}::${lineIndex}`;

  const [displayed, setDisplayed] = useKeyedState(stepKey, () => "");
  const [typing, setTyping] = useKeyedState(stepKey, () => true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(currentLine);
      setTyping(false);
      return;
    }
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setDisplayed(currentLine.slice(0, i));
      if (i >= currentLine.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTyping(false);
      }
    }, TYPE_SPEED_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey, shouldReduceMotion]);

  function handleAdvance() {
    playSound("click");
    if (typing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(currentLine);
      setTyping(false);
      return;
    }
    if (isLastLine) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  }

  return (
    <div className="flex items-start gap-4">
      <motion.div
        aria-hidden="true"
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-[#1c2740] text-2xl sm:h-20 sm:w-20"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        🕵️‍♂️
      </motion.div>

      <div className="noir-panel relative min-h-[6rem] flex-1 rounded-lg px-5 py-4">
        <p className="mb-1 font-noir text-xs uppercase tracking-widest text-accent">
          Chief Marlowe
        </p>
        <p className="min-h-[3.5rem] font-noir text-base leading-relaxed text-foreground/90 sm:text-lg">
          {displayed}
          {typing && <span className="animate-pulse">▍</span>}
        </p>
        <button
          onClick={handleAdvance}
          className="mt-3 rounded border border-accent-soft/40 px-4 py-1.5 text-sm text-accent-soft transition hover:bg-accent-soft/10"
        >
          {typing ? "Skip ▸" : isLastLine ? continueLabel : "Next ▸"}
        </button>
      </div>
    </div>
  );
}
