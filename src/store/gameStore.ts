import { create } from "zustand";
import { Achievement, QueryResult, Screen } from "@/types";
import { BADGE_CATALOG } from "@/lib/badges";
import { MISSIONS } from "@/lib/missions";

export type MissionPhase =
  | "briefing"
  | "task-intro"
  | "task-active"
  | "task-review"
  | "task-success"
  | "debrief"
  | "complete";

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
  hintsUsed: Record<string, number>;
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
  revealHint: (taskId: string) => void;
  setLastQueryResult: (result: QueryResult | null) => void;
  pushSqlHistory: (sql: string) => void;
  toggleSound: () => void;
  setSelectedTable: (name: string | null) => void;
}

export const XP_PER_LEVEL = 150;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): { current: number; needed: number; percent: number } {
  const current = xp % XP_PER_LEVEL;
  return { current, needed: XP_PER_LEVEL, percent: Math.round((current / XP_PER_LEVEL) * 100) };
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "intro",
  xp: 0,
  earnedBadgeIds: [],
  achievementQueue: [],
  earnedClueIds: [],
  newlyUnlockedClueId: null,

  currentMissionId: MISSIONS[0].id,
  currentTaskIndex: 0,
  missionPhase: "briefing",
  hintsUsed: {},
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
      screen: "mission",
    }),

  setMissionPhase: (phase) => set({ missionPhase: phase }),

  advancePastIntro: () => set({ missionPhase: "task-active" }),

  completeCurrentTask: () => {
    const mission = MISSIONS.find((m) => m.id === get().currentMissionId);
    if (!mission) return;
    const task = mission.tasks[get().currentTaskIndex];
    if (!task) return;

    const penalty = (get().hintsUsed[task.id] ?? 0) > 0
      ? mission.tasks[get().currentTaskIndex].hints
          .slice(0, get().hintsUsed[task.id] ?? 0)
          .reduce((sum, h) => sum + h.xpPenalty, 0)
      : 0;
    const awarded = Math.max(10, task.xpReward - penalty);

    set({ missionPhase: "task-success" });
    get().addXP(awarded);
    if (task.badgeId) get().earnBadge(task.badgeId);
    get().earnClue(task.clueId);
  },

  goToNextTask: () => {
    const mission = MISSIONS.find((m) => m.id === get().currentMissionId);
    if (!mission) return;
    const nextIndex = get().currentTaskIndex + 1;
    if (nextIndex >= mission.tasks.length) {
      set({ missionPhase: "debrief" });
    } else {
      set({ currentTaskIndex: nextIndex, missionPhase: "task-intro", lastQueryResult: null });
    }
  },

  finishMission: () => {
    const mission = MISSIONS.find((m) => m.id === get().currentMissionId);
    if (!mission) return;
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

  revealHint: (taskId) =>
    set((state) => ({
      hintsUsed: { ...state.hintsUsed, [taskId]: (state.hintsUsed[taskId] ?? 0) + 1 },
    })),

  setLastQueryResult: (result) => set({ lastQueryResult: result }),

  pushSqlHistory: (sql) =>
    set((state) => ({ sqlHistory: [sql, ...state.sqlHistory].slice(0, 20) })),

  toggleSound: () => set((state) => ({ soundMuted: !state.soundMuted })),

  setSelectedTable: (name) => set({ selectedTable: name }),
}));
