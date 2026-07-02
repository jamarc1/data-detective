export type Screen = "intro" | "office" | "mission" | "caseClosed";

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  error?: string;
  raw?: unknown;
}

export interface MissionTask {
  id: string;
  concept: "SELECT" | "WHERE" | "ORDER BY";
  chiefIntro: string[];
  /** The detective question this challenge answers, shown on the Current Mission card. */
  detectiveQuestion: string;
  instructions: string;
  starterSql: string;
  /** Small always-visible SQL structure hint, e.g. "SELECT *\nFROM ...". Not the full answer. */
  sqlStarter: string;
  /** The full correct query, only shown if the player clicks "Show Answer". */
  answerSql: string;
  /** Plain-English preview of what a correct query should return, shown before the player runs anything. */
  expectedResult: string;
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
}
