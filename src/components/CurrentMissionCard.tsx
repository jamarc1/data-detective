"use client";

import { MissionTask } from "@/types";

interface CurrentMissionCardProps {
  task: MissionTask;
}

export default function CurrentMissionCard({ task }: CurrentMissionCardProps) {
  return (
    <div className="noir-panel rounded-lg p-3">
      <h2 className="mb-2 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        Current Mission
      </h2>
      <div className="flex flex-col gap-2 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">
            Detective Question
          </p>
          <p className="font-noir text-sm text-accent-soft">{task.detectiveQuestion}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">Objective</p>
          <p className="text-sm text-foreground/80">{task.instructions}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">Starter Query</p>
          <pre className="whitespace-pre-wrap rounded-md border border-panel-border bg-black/20 p-2 font-mono text-xs text-accent-soft">
            {task.sqlStarter}
          </pre>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-foreground/40">Expected Result</p>
          <p className="text-sm text-foreground/70">{task.expectedResult}</p>
        </div>
      </div>
    </div>
  );
}
