"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  /** Overrides the "current/total" text, e.g. "Lead 1 of 4". */
  valueLabel?: string;
}

export default function ProgressBar({ currentStep, totalSteps, label, valueLabel }: ProgressBarProps) {
  const percent = totalSteps === 0 ? 0 : Math.round((currentStep / totalSteps) * 100);

  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-foreground/50">
        <span>{label ?? "Case Progress"}</span>
        <span>{valueLabel ?? `${currentStep}/${totalSteps}`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
        <motion.div
          className="h-full rounded-full bg-success"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
