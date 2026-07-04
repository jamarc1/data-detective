export type Screen = "intro" | "office" | "mission" | "caseClosed";

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  error?: string;
  raw?: unknown;
}

export interface ProgressiveHints {
  /** Tier 1 — a nudge toward the case, no SQL. */
  detective: string;
  /** Tier 2 — points at the table/column/clause involved, still no full query. */
  data: string;
  /** Tier 3 — the full correct query. */
  sql: string;
}

export interface MissionTask {
  id: string;
  concept: "SELECT" | "WHERE" | "ORDER BY";
  chiefIntro: string[];
  /** The detective question this challenge answers, shown on the Current Lead card. */
  detectiveQuestion: string;
  /** Short in-character Marlowe line shown on the Current Lead card. */
  chiefLine: string;
  /** Short label for what evidence this challenge unlocks, e.g. "Case Archive". */
  evidenceAvailable: string;
  instructions: string;
  starterSql: string;
  /** Progressive hints revealed one at a time behind the "Need a Hint" button. */
  hints: ProgressiveHints;
  badgeId?: string;
  clueId?: string;
  successDialogue: string[];
  validate: (sql: string, result: QueryResult) => { success: boolean; message?: string };
  /** A short, in-world observation about what a successful query turned up, shown above the results grid. */
  resultInsight?: (result: QueryResult) => string | null;
}

export interface Mission {
  id: string;
  title: string;
  caseNumber: string;
  briefing: string[];
  tasks: MissionTask[];
  debrief: string[];
  badgeOnComplete: string;
  xpOnComplete: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Short in-world payoff line — what this clue lets the detective see now. Used in Marlowe's unlock dialogue. */
  revealHook: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TableSchemaColumn {
  name: string;
  type: string;
}

export interface TableSchema {
  name: string;
  description: string;
  columns: TableSchemaColumn[];
  caseName?: string;
  tagline?: string;
  contains?: string[];
}
