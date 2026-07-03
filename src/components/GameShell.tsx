"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MISSIONS } from "@/lib/missions";
import { runQuery } from "@/lib/duckdb";
import { playSound } from "@/lib/sound";
import { pickFillerLine, maybePickReflectionLine } from "@/lib/dialogue";
import { CLUE_CATALOG } from "@/lib/clues";
import ChiefDialogue from "./ChiefDialogue";
import CurrentMissionCard from "./CurrentMissionCard";
import Sidebar from "./Sidebar";
import SqlEditor from "./SqlEditor";
import ResultsGrid from "./ResultsGrid";
import XPBar from "./XPBar";
import ProgressBar from "./ProgressBar";
import BadgeCase from "./BadgeCase";
import InvestigationBoard from "./InvestigationBoard";
import SoundToggle from "./SoundToggle";

export default function GameShell() {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const currentTaskIndex = useGameStore((s) => s.currentTaskIndex);
  const missionPhase = useGameStore((s) => s.missionPhase);
  const earnedBadgeIds = useGameStore((s) => s.earnedBadgeIds);
  const lastQueryResult = useGameStore((s) => s.lastQueryResult);
  const setLastQueryResult = useGameStore((s) => s.setLastQueryResult);
  const pushSqlHistory = useGameStore((s) => s.pushSqlHistory);
  const completeCurrentTask = useGameStore((s) => s.completeCurrentTask);
  const goToNextTask = useGameStore((s) => s.goToNextTask);
  const finishMission = useGameStore((s) => s.finishMission);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const setMissionPhase = useGameStore((s) => s.setMissionPhase);
  const recordWrongAttempt = useGameStore((s) => s.recordWrongAttempt);
  const lastXpBreakdown = useGameStore((s) => s.lastXpBreakdown);

  const mission = MISSIONS.find((m) => m.id === currentMissionId) ?? MISSIONS[0];
  const task = mission.tasks[currentTaskIndex];

  // Evidence unlocks progressively: only tables introduced by the current
  // lead or an earlier one are visible, so the next table stays a mystery
  // until the player has actually earned it.
  const unlockedTables = Array.from(
    new Set(mission.tasks.slice(0, currentTaskIndex + 1).flatMap((t) => t.relevantTables))
  );

  const resultInsight =
    lastQueryResult && !lastQueryResult.error && task?.resultInsight
      ? task.resultInsight(lastQueryResult)
      : null;

  const unlockedClue = task?.clueId ? CLUE_CATALOG[task.clueId] : undefined;

  const stepKey = `${currentTaskIndex}::${missionPhase}`;

  // Keyed on the task alone (not the phase) — the editor and any validation
  // message should only reset when a genuinely new task begins, not when
  // moving from task-active into task-review for the same query.
  const taskKey = String(currentTaskIndex);
  const [trackedTaskKey, setTrackedTaskKey] = useState(taskKey);
  const [sqlValue, setSqlValue] = useState("");
  const [running, setRunning] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Picked once per task-success entry so Marlowe opens with a fresh reaction
  // instead of jumping straight into the case-specific line.
  const [successFillerKey, setSuccessFillerKey] = useState(stepKey);
  const [successFiller, setSuccessFiller] = useState("");

  // Picked once per task-review entry — Marlowe only occasionally chimes in
  // while the player is looking over the evidence, so this can be null.
  const [reviewLineKey, setReviewLineKey] = useState(stepKey);
  const [reviewLine, setReviewLine] = useState<string | null>(null);

  if (taskKey !== trackedTaskKey) {
    setTrackedTaskKey(taskKey);
    setSqlValue("");
    setValidationMessage(null);
  }

  if (missionPhase === "task-success" && stepKey !== successFillerKey) {
    setSuccessFillerKey(stepKey);
    setSuccessFiller(pickFillerLine(successFiller || undefined));
  }

  if (missionPhase === "task-review" && stepKey !== reviewLineKey) {
    setReviewLineKey(stepKey);
    setReviewLine(maybePickReflectionLine(reviewLine ?? undefined));
  }

  async function handleRun() {
    playSound("queryRun");
    setRunning(true);
    setValidationMessage(null);
    const result = await runQuery(sqlValue);
    setLastQueryResult(result);
    pushSqlHistory(sqlValue);
    setRunning(false);

    if (missionPhase === "task-active" && task) {
      const verdict = task.validate(sqlValue, result);
      if (verdict.success) {
        playSound("success");
        // Don't auto-complete — let the player review the evidence first.
        // completeCurrentTask() only fires once they click "Continue Investigation".
        setMissionPhase("task-review");
      } else {
        playSound("error");
        setValidationMessage(verdict.message ?? "Not quite — try again.");
        recordWrongAttempt(task.id);
      }
    }
  }

  function handleContinueInvestigation() {
    playSound("click");
    completeCurrentTask();
  }

  if (!task && missionPhase !== "debrief" && missionPhase !== "complete") {
    return null;
  }

  if (missionPhase === "task-intro") {
    return (
      <CenteredDialogueScreen caseLabel={mission.caseNumber}>
        <ChiefDialogue
          lines={task.chiefIntro}
          onComplete={() => setMissionPhase("task-active")}
          continueLabel="Open the terminal"
        />
      </CenteredDialogueScreen>
    );
  }

  if (missionPhase === "task-success") {
    return (
      <CenteredDialogueScreen caseLabel={mission.caseNumber}>
        <ChiefDialogue
          lines={[
            successFiller,
            ...task.successDialogue,
            ...(unlockedClue
              ? [`"Good work. You've unlocked the ${unlockedClue.title}. ${unlockedClue.revealHook}"`]
              : []),
          ]}
          onComplete={() => goToNextTask()}
          continueLabel={currentTaskIndex + 1 >= mission.tasks.length ? "Wrap up the case" : "Next lead"}
        />
        {lastXpBreakdown && (
          <div className="noir-panel mt-4 rounded-lg p-3 text-sm">
            <p className="mb-1 font-noir text-xs uppercase tracking-widest text-accent">Mission XP</p>
            <p className="text-foreground/70">{lastXpBreakdown.base} Base</p>
            {lastXpBreakdown.adjustments.map((adj) => (
              <p key={adj.label} className={adj.amount >= 0 ? "text-accent-soft" : "text-danger"}>
                {adj.amount >= 0 ? `+${adj.amount}` : adj.amount} {adj.label}
              </p>
            ))}
            <p className="mt-1 font-noir text-accent-soft">= {lastXpBreakdown.total} XP</p>
          </div>
        )}
      </CenteredDialogueScreen>
    );
  }

  if (missionPhase === "debrief") {
    return (
      <CenteredDialogueScreen caseLabel={mission.caseNumber}>
        <ChiefDialogue
          lines={mission.debrief}
          onComplete={() => finishMission()}
          continueLabel="Close the case"
        />
      </CenteredDialogueScreen>
    );
  }

  if (missionPhase === "complete") {
    return (
      <div className="film-grain flex min-h-screen flex-col items-center justify-center gap-6 bg-[#05070d] px-6 text-center">
        <p className="font-noir text-xs uppercase tracking-[0.3em] text-accent-soft/60">
          {mission.caseNumber} — Closed
        </p>
        <h1 className="font-noir text-4xl text-accent-soft sm:text-5xl">Case Closed 💎</h1>
        <p className="font-noir text-lg text-accent-soft/80">{mission.title}</p>
        <p className="max-w-md text-foreground/60">Warrant recommended.</p>
        <div className="mt-4 w-full max-w-sm">
          <XPBar />
        </div>
        <p className="text-xs uppercase tracking-widest text-foreground/40">
          Skills used: SELECT · WHERE · ORDER BY
        </p>
        <BadgeCase />
        <div className="w-full max-w-sm text-left">
          <InvestigationBoard />
        </div>
        <p className="text-xs uppercase tracking-widest text-foreground/30">Next Case: Coming Soon</p>
        <button
          onClick={() => goToScreen("office")}
          className="mt-2 rounded-md border-2 border-accent bg-accent/10 px-6 py-3 font-noir text-accent-soft transition hover:bg-accent/20"
        >
          Return to the office
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#05070d] p-4 sm:p-6">
      {/*
        Direct grid children render in the exact order a mobile (single-column)
        player should see them: Header, Progress, Current Lead, Editor, Results,
        Database Reference, Investigation Board, Badges. On md/xl, explicit
        col-start/row-start placement re-creates the multi-column desktop
        layout without needing to reorder the DOM. Current Lead already covers
        the objective, so there's no separate Objective card to duplicate it.
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr_300px]">
        <header className="noir-panel col-span-full flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-noir text-xs uppercase tracking-widest text-foreground/40">
              {mission.caseNumber}
            </p>
            <h1 className="font-noir text-lg text-accent-soft">{mission.title}</h1>
          </div>
          <div className="flex flex-1 items-center gap-4 sm:max-w-md">
            <XPBar />
            <SoundToggle />
          </div>
        </header>

        <div className="noir-panel col-span-full rounded-lg p-3">
          <ProgressBar
            currentStep={
              currentTaskIndex + (missionPhase === "task-active" || missionPhase === "task-review" ? 0 : 1)
            }
            totalSteps={mission.tasks.length}
            label="Case Progress"
            valueLabel={`Lead ${currentTaskIndex + 1} of ${mission.tasks.length}`}
          />
        </div>

        <CurrentMissionCard task={task} onInsertAnswer={setSqlValue} className="col-span-full" />

        <div className="flex flex-col gap-4 md:col-start-2 md:row-start-4">
          <SqlEditor
            value={sqlValue}
            onChange={setSqlValue}
            onRun={handleRun}
            running={running}
            placeholder={task.sqlPlaceholder}
          />
          {validationMessage && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger"
            >
              {validationMessage}
            </motion.p>
          )}
          {missionPhase === "task-review" && reviewLine && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-accent-soft"
            >
              <span className="mr-1 font-noir text-xs uppercase tracking-widest text-accent">
                Chief Marlowe:
              </span>
              {reviewLine}
            </motion.p>
          )}
        </div>

        <div className="flex flex-col gap-4 md:col-start-2 md:row-start-5">
          <ResultsGrid
            result={lastQueryResult}
            insight={resultInsight}
            celebrate={missionPhase === "task-review"}
          />
          {missionPhase === "task-review" && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleContinueInvestigation}
              className="self-start rounded-md border-2 border-accent bg-accent/10 px-6 py-3 font-noir text-accent-soft transition hover:bg-accent/20"
            >
              Continue Investigation ▸
            </motion.button>
          )}
        </div>

        <Sidebar
          onInsertQuery={setSqlValue}
          relevantTables={task.relevantTables}
          unlockedTables={unlockedTables}
          className="md:col-start-1 md:row-start-4 md:row-span-2"
        />

        {/* Investigation Board and Badges stay out of the way until there's
            something to show — an empty clue board or a wall of locked badge
            icons reads as clutter, not progress, on a player's first lead. */}
        <AnimatePresence>
          {currentTaskIndex > 0 && (
            <motion.div
              key="investigation-board"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-full md:row-start-6 xl:col-span-1 xl:col-start-3 xl:row-start-4"
            >
              <InvestigationBoard />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {earnedBadgeIds.length > 0 && (
            <motion.div
              key="badge-case"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-full md:row-start-7 xl:col-span-1 xl:col-start-3 xl:row-start-5"
            >
              <BadgeCase />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CenteredDialogueScreen({
  children,
  caseLabel,
}: {
  children: React.ReactNode;
  caseLabel: string;
}) {
  return (
    <div className="film-grain flex min-h-screen w-full items-center justify-center bg-[#05070d] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <p className="mb-3 text-center font-noir text-xs uppercase tracking-[0.3em] text-foreground/40">
          {caseLabel}
        </p>
        {children}
      </motion.div>
    </div>
  );
}
