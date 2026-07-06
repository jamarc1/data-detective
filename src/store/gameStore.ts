import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Achievement, QueryResult, Screen } from "@/types";
import { BADGE_CATALOG } from "@/lib/badges";
import { getMissionById, MISSIONS } from "@/lib/missions";

export type MissionPhase =
  | "briefing"
  | "task-intro"
  | "task-active"
  | "task-review"
  | "task-success"
  | "debrief"
  | "complete";

export interface XpBreakdown {
  base: number;
  adjustments: { label: string; amount: number }[];
  total: number;
}

interface GameState {
  screen: Screen;
  xp: number;
  earnedBadgeIds: string[];
  achievementQueue: Achievement[];
  earnedClueIds: string[];
  newlyUnlockedClueId: string | null;

  currentMissionId: string;
  currentTaskIndex: number;
  missionPhase: MissionPhase;
  wrongAttempts: Record<string, number>;
  answerUsedTaskIds: string[];
  /** Progressive hint tier revealed per task: 0 = none, 1 = detective, 2 = data, 3 = sql. */
  hintTier: Record<string, number>;
  lastXpBreakdown: XpBreakdown | null;
  lastQueryResult: QueryResult | null;
  sqlHistory: string[];
  soundMuted: boolean;
  selectedTable: string | null;

  goToScreen: (screen: Screen) => void;
  startMission: (missionId: string) => void;
  setMissionPhase: (phase: MissionPhase) => void;
  advancePastIntro: () => void;
  completeCurrentTask: () => void;
  goToNextTask: () => void;
  finishMission: () => void;
  addXP: (amount: number) => void;
  earnBadge: (badgeId: string) => void;
  earnClue: (clueId?: string) => void;
  clearNewClue: () => void;
  popAchievement: () => void;
  recordWrongAttempt: (taskId: string) => void;
  markAnswerUsed: (taskId: string) => void;
  advanceHint: (taskId: string) => void;
  setLastQueryResult: (result: QueryResult | null) => void;
  pushSqlHistory: (sql: string) => void;
  toggleSound: () => void;
  setSelectedTable: (name: string | null) => void;
}

// Simplified, transparent scoring. "Answer used" is set once a player reaches
// hint tier 3 (the full SQL query) via advanceHint().
const BASE_MISSION_XP = 100;
const CLEAN_SOLVE_BONUS = 25;
const ANSWER_USED_PENALTY = 25;
const WRONG_ATTEMPTS_PENALTY = 10;
const WRONG_ATTEMPTS_THRESHOLD = 3;
const MIN_MISSION_XP = 50;

interface PersistedGameState {
  xp: number;
  earnedBadgeIds: string[];
  earnedClueIds: string[];
  currentMissionId: string;
  currentTaskIndex: number;
  wrongAttempts: Record<string, number>;
  answerUsedTaskIds: string[];
  hintTier: Record<string, number>;
  soundMuted: boolean;
  screen: Screen;
  missionPhase: MissionPhase;
}

export const XP_PER_LEVEL = 150;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): { current: number; needed: number; percent: number } {
  const current = xp % XP_PER_LEVEL;
  return { current, needed: XP_PER_LEVEL, percent: Math.round((current / XP_PER_LEVEL) * 100) };
}

export function getLevelTitle(level: number): string {
  if (level <= 3) return "Rookie Detective";
  if (level <= 6) return "Detective";
  if (level <= 9) return "Senior Detective";
  return "Chief Inspector";
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
  screen: "intro",
  xp: 0,
  earnedBadgeIds: [],
  achievementQueue: [],
  earnedClueIds: [],
  newlyUnlockedClueId: null,

  currentMissionId: MISSIONS[0].id,
  currentTaskIndex: 0,
  missionPhase: "briefing",
  wrongAttempts: {},
  answerUsedTaskIds: [],
  hintTier: {},
  lastXpBreakdown: null,
  lastQueryResult: null,
  sqlHistory: [],
  soundMuted: false,
  selectedTable: null,

  goToScreen: (screen) => set({ screen }),

  startMission: (missionId) =>
    set({
      currentMissionId: missionId,
      currentTaskIndex: 0,
      missionPhase: "task-intro",
      lastQueryResult: null,
      earnedClueIds: [],
      newlyUnlockedClueId: null,
      wrongAttempts: {},
      answerUsedTaskIds: [],
      hintTier: {},
      lastXpBreakdown: null,
      screen: "mission",
    }),

  setMissionPhase: (phase) => set({ missionPhase: phase }),

  advancePastIntro: () => set({ missionPhase: "task-active" }),

  completeCurrentTask: () => {
    const mission = getMissionById(get().currentMissionId);
    const task = mission.tasks[get().currentTaskIndex];
    if (!task) return;

    const usedAnswer = get().answerUsedTaskIds.includes(task.id);
    const attempts = get().wrongAttempts[task.id] ?? 0;

    const adjustments: { label: string; amount: number }[] = [];
    let xp = BASE_MISSION_XP;

    if (usedAnswer) {
      adjustments.push({ label: "Answer Used", amount: -ANSWER_USED_PENALTY });
      xp -= ANSWER_USED_PENALTY;
    } else {
      adjustments.push({ label: "Clean Solve Bonus", amount: CLEAN_SOLVE_BONUS });
      xp += CLEAN_SOLVE_BONUS;
    }

    if (attempts >= WRONG_ATTEMPTS_THRESHOLD) {
      adjustments.push({ label: "Wrong Attempts", amount: -WRONG_ATTEMPTS_PENALTY });
      xp -= WRONG_ATTEMPTS_PENALTY;
    }

    const total = Math.max(MIN_MISSION_XP, xp);

    set({ missionPhase: "task-success", lastXpBreakdown: { base: BASE_MISSION_XP, adjustments, total } });
    get().addXP(total);
    if (task.badgeId) get().earnBadge(task.badgeId);
    get().earnClue(task.clueId);
  },

  goToNextTask: () => {
    const mission = getMissionById(get().currentMissionId);
    const nextIndex = get().currentTaskIndex + 1;
    if (nextIndex >= mission.tasks.length) {
      set({ missionPhase: "debrief" });
    } else {
      set({ currentTaskIndex: nextIndex, missionPhase: "task-intro", lastQueryResult: null });
    }
  },

  finishMission: () => {
    const mission = getMissionById(get().currentMissionId);
    get().addXP(mission.xpOnComplete);
    get().earnBadge(mission.badgeOnComplete);
    set({ missionPhase: "complete" });
  },

  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

  earnBadge: (badgeId) => {
    if (get().earnedBadgeIds.includes(badgeId)) return;
    const badge = BADGE_CATALOG[badgeId];
    if (!badge) return;
    set((state) => ({
      earnedBadgeIds: [...state.earnedBadgeIds, badgeId],
      achievementQueue: [
        ...state.achievementQueue,
        { id: badge.id, title: badge.name, description: badge.description, icon: badge.icon },
      ],
    }));
  },

  earnClue: (clueId) => {
    if (!clueId) return;
    if (get().earnedClueIds.includes(clueId)) return;
    set((state) => ({
      earnedClueIds: [...state.earnedClueIds, clueId],
      newlyUnlockedClueId: clueId,
    }));
  },

  clearNewClue: () => set({ newlyUnlockedClueId: null }),

  popAchievement: () =>
    set((state) => ({ achievementQueue: state.achievementQueue.slice(1) })),

  recordWrongAttempt: (taskId) =>
    set((state) => ({
      wrongAttempts: { ...state.wrongAttempts, [taskId]: (state.wrongAttempts[taskId] ?? 0) + 1 },
    })),

  markAnswerUsed: (taskId) => {
    if (get().answerUsedTaskIds.includes(taskId)) return;
    set((state) => ({ answerUsedTaskIds: [...state.answerUsedTaskIds, taskId] }));
  },

  advanceHint: (taskId) => {
    const next = Math.min(3, (get().hintTier[taskId] ?? 0) + 1);
    set((state) => ({ hintTier: { ...state.hintTier, [taskId]: next } }));
    // Reaching the SQL hint (tier 3) is the same as being handed the answer.
    if (next >= 3) get().markAnswerUsed(taskId);
  },

  setLastQueryResult: (result) => set({ lastQueryResult: result }),

  pushSqlHistory: (sql) =>
    set((state) => ({ sqlHistory: [sql, ...state.sqlHistory].slice(0, 20) })),

  toggleSound: () => set((state) => ({ soundMuted: !state.soundMuted })),

  setSelectedTable: (name) => set({ selectedTable: name }),
    }),
    {
      name: "data-detective-save-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedGameState => ({
        xp: state.xp,
        earnedBadgeIds: state.earnedBadgeIds,
        earnedClueIds: state.earnedClueIds,
        currentMissionId: state.currentMissionId,
        currentTaskIndex: state.currentTaskIndex,
        wrongAttempts: state.wrongAttempts,
        answerUsedTaskIds: state.answerUsedTaskIds,
        hintTier: state.hintTier,
        soundMuted: state.soundMuted,
        screen: state.screen,
        missionPhase: state.missionPhase,
      }),
      merge: (persistedState, currentState) => {
        // No save data at all (first-ever visit) — keep the real defaults
        // (screen: "intro") instead of falling through to the "office" branch.
        if (!persistedState) return currentState;
        const persisted = persistedState as Partial<PersistedGameState>;
        const screen: Screen =
          persisted.screen === "intro" && (persisted.xp ?? 0) === 0 ? "intro" : "office";
        const missionPhase: MissionPhase =
          persisted.missionPhase === "complete" ? "complete" : "task-intro";
        return {
          ...currentState,
          ...persisted,
          screen,
          missionPhase,
        };
      },
    }
  )
);
