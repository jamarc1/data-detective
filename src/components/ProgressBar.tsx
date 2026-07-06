"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export default function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  const segments = Array.from({ length: totalSteps }, (_, i) => i < currentStep);

  return (
    <div>
      <div className="mb-2 flex justify-between font-mono text-[11px] text-foreground/50">
        <span>{label ?? "Case Progress"}</span>
        <span>
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-label={`${label ?? "Case Progress"}: ${currentStep} of ${totalSteps}`}
        className="flex gap-1"
      >
        {segments.map((filled, i) => (
          <motion.div
            key={i}
            className={`flex-1 h-1.5 rounded-sm transition-all ${
              filled ? "bg-accent shadow-sm shadow-accent/40" : "bg-black/40"
            }`}
            animate={{ opacity: filled ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
