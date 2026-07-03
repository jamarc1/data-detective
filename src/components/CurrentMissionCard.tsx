"use client";

import { MissionTask } from "@/types";
import HintEngine from "./HintEngine";

interface CurrentMissionCardProps {
  task: MissionTask;
  onInsertAnswer?: (sql: string) => void;
  className?: string;
}

export default function CurrentMissionCard({
  task,
  onInsertAnswer,
  className = "",
}: CurrentMissionCardProps) {
  return (
    <div className={`noir-panel rounded-lg p-3 ${className}`}>
      <h2 className="mb-2 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        Current Lead
      </h2>
      <div className="flex flex-col gap-2 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">
            Detective Question
          </p>
          <p className="font-noir text-sm text-accent-soft">{task.detectiveQuestion}</p>
        </div>

        <p className="text-sm italic text-foreground/70">&ldquo;{task.chiefLine}&rdquo;</p>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">
            Evidence Available
          </p>
          <p className="text-sm text-foreground/80">{task.evidenceAvailable}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">
            {task.relevantTables.length > 1 ? "Relevant Tables" : "Relevant Table"}
          </p>
          <p className="font-mono text-sm text-accent-soft">{task.relevantTables.join(", ")}</p>
          <p className="mt-1 text-xs text-foreground/50">
            Need fields? Open Database Reference below.
          </p>
        </div>

        <HintEngine task={task} onInsertAnswer={onInsertAnswer} />
      </div>
    </div>
  );
}
