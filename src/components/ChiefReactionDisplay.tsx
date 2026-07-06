"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { ChiefReactionTiers } from "@/types";

interface ChiefReactionDisplayProps {
  reactions?: ChiefReactionTiers;
}

export default function ChiefReactionDisplay({ reactions }: ChiefReactionDisplayProps) {
  const wrongAttempts = useGameStore((s) => s.wrongAttempts);
  const answerUsedTaskIds = useGameStore((s) => s.answerUsedTaskIds);
  const currentTaskIndex = useGameStore((s) => s.currentTaskIndex);

  if (!reactions) return null;

  const taskId = `task-${currentTaskIndex}`; // This is a rough approximation
  const attempts = wrongAttempts[taskId] ?? 0;
  const usedAnswer = answerUsedTaskIds.includes(taskId);

  // Determine reaction tier
  let line: string;
  if (usedAnswer || attempts >= 3) {
    line = reactions.bruteForce || reactions.standard;
  } else if (attempts === 0) {
    line = reactions.clean || reactions.standard;
  } else {
    line = reactions.standard;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm"
    >
      <span className="mr-1 font-noir text-xs uppercase tracking-widest text-accent">
        Chief Marlowe:
      </span>
      <span className="text-accent-soft italic">"{line}"</span>
    </motion.div>
  );
}
