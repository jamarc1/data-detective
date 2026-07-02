"use client";

import { MissionTask } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface HintEngineProps {
  task: MissionTask;
  onInsertAnswer?: (sql: string) => void;
}

export default function HintEngine({ task, onInsertAnswer }: HintEngineProps) {
  const answerUsedTaskIds = useGameStore((s) => s.answerUsedTaskIds);
  const markAnswerUsed = useGameStore((s) => s.markAnswerUsed);
  const revealed = answerUsedTaskIds.includes(task.id);

  function handleShowAnswer() {
    playSound("click");
    markAnswerUsed(task.id);
    onInsertAnswer?.(task.answerSql);
  }

  return (
    <div className="noir-panel rounded-lg p-3">
      <h2 className="mb-2 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        SQL Starter
      </h2>
      <pre className="whitespace-pre-wrap rounded-md border border-panel-border bg-black/20 p-2 font-mono text-xs text-accent-soft">
        {task.sqlStarter}
      </pre>

      {revealed ? (
        <div className="mt-2 rounded-md border border-accent/40 bg-accent/5 p-2">
          <p className="mb-1 px-0 text-[11px] uppercase tracking-widest text-accent">Answer</p>
          <pre className="whitespace-pre-wrap font-mono text-xs text-accent-soft">{task.answerSql}</pre>
        </div>
      ) : (
        <button
          onClick={handleShowAnswer}
          className="mt-2 self-start rounded border border-accent-soft/40 px-3 py-1.5 text-xs text-accent-soft transition hover:bg-accent-soft/10"
        >
          Show Answer
        </button>
      )}
    </div>
  );
}
