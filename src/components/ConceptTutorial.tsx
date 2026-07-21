"use client";

import { motion } from "framer-motion";
import { MissionTask } from "@/types";

interface ConceptTutorialProps {
  task: MissionTask;
  onContinue: () => void;
  onSkip: () => void;
}

const CONCEPT_AVATARS: Record<string, string> = {
  SELECT: "📋",
  WHERE: "🔍",
  "ORDER BY": "📊",
  JOIN: "🔗",
};

export default function ConceptTutorial({
  task,
  onContinue,
  onSkip,
}: ConceptTutorialProps) {
  if (!task.conceptExplainer) return null;

  const avatar = CONCEPT_AVATARS[task.concept] || "🕵️";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-2xl rounded-lg border border-accent/30 bg-gradient-to-br from-[#1a1f2e] to-[#0f1319] p-12 text-center"
      >
        {/* Avatar */}
        <div className="mb-6 text-6xl">{avatar}</div>

        {/* Title */}
        <h2 className="mb-4 font-noir text-3xl text-accent-soft">{task.concept}</h2>

        {/* Intro */}
        <div className="mb-8 space-y-3">
          {task.conceptExplainer.briefing.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/80">
              {line}
            </p>
          ))}
        </div>

        {/* Example Query */}
        <div className="mb-8 rounded-lg border border-accent/20 bg-[#05070d] p-6 text-left">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
            Example Query
          </p>
          <pre className="mb-3 font-mono text-sm text-accent-soft">
            {task.conceptExplainer.exampleSql}
          </pre>
          <p className="font-mono text-xs text-foreground/60">
            → Try this query. See how it works?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onContinue}
            className="rounded-md border-2 border-accent bg-accent/10 px-8 py-3 font-noir text-accent-soft transition hover:bg-accent/20"
          >
            Got It — Continue
          </button>
          <button
            onClick={onSkip}
            className="rounded-md border border-foreground/40 px-8 py-3 font-noir text-foreground/60 transition hover:bg-foreground/5"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
