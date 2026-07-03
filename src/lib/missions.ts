import { Mission, QueryResult } from "@/types";

function sqlHas(sql: string, pattern: RegExp): boolean {
  return pattern.test(sql.replace(/\s+/g, " ").trim());
}

/**
 * Checks whether `rows` are consistently sorted by `key`, in either direction.
 * Compares numerically when possible (e.g. age), otherwise falls back to
 * string comparison (e.g. "HH:MM" timestamps like last_seen_time).
 */
function isSortedByKey(
  rows: Record<string, unknown>[],
  key: string
): "asc" | "desc" | null {
  const values = rows.map((r) => r[key]);
  if (values.some((v) => v === null || v === undefined)) return null;

  const compare = (a: unknown, b: unknown): number => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  };

  const asc = values.every((v, i) => i === 0 || compare(values[i - 1], v) <= 0);
  if (asc) return "asc";

  const desc = values.every((v, i) => i === 0 || compare(values[i - 1], v) >= 0);
  if (desc) return "desc";

  return null;
}

export const MISSION_1: Mission = {
  id: "mission-1",
  title: "The Vantage Gala Heist",
  caseNumber: "Case No. 0114",
  briefing: [
    "Chief Marlowe slides a case file across the desk without looking up.",
    "\"The Vantage Diamond is gone. Ten guests. One thief. The cameras cut out at 11:40.\"",
    "\"Every case starts with the file. Pull it up.\"",
  ],
  tasks: [
    {
      id: "task-crimes-select",
      concept: "SELECT",
      chiefIntro: [
        "\"What happened? That's where we start.\"",
        "\"Pull the case archive.\"",
      ],
      detectiveQuestion: "What case are we working?",
      chiefLine: "Three cases are sitting in the archive. One still needs solving.",
      evidenceAvailable: "Case Archive",
      relevantTables: ["crimes"],
      instructions: "Open the case archive.",
      starterSql: "-- Write your query below\n",
      hints: {
        detective: "Start with the case archive.",
        data: "The case archive is stored in the crimes table.",
        sql: "SELECT *\nFROM crimes;",
      },
      successDialogue: [
        "\"The Vantage Gala Heist. Still open — one suspect already flagged.\"",
        "\"Let's find out who was actually there.\"",
      ],
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /select/i)) {
          return { success: false, message: "Your query needs to start with SELECT." };
        }
        if (!sqlHas(sql, /from\s+crimes/i)) {
          return { success: false, message: "You need to read FROM the crimes table." };
        }
        if (result.rowCount !== 3) {
          return {
            success: false,
            message: `Expected all 3 case files, but got ${result.rowCount}. Don't filter anything out yet.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "The archive's empty. That's not right.";
        if (result.rowCount === 3) return "Three cases sit in the archive. Only one is still open.";
        return `${result.rowCount} cases pulled so far — the archive holds three.`;
      },
    },
    {
      id: "task-select",
      concept: "SELECT",
      chiefIntro: ["\"Who was there? Pull the guest list.\""],
      detectiveQuestion: "Who attended the gala?",
      chiefLine: "Everybody leaves a trail. Find everyone who was there.",
      evidenceAvailable: "Guest List",
      relevantTables: ["people"],
      instructions: "Pull the guest list.",
      starterSql: "-- Write your query below\n",
      hints: {
        detective: "Start with the guest list.",
        data: "The guest list lives in the people table.",
        sql: "SELECT *\nFROM people;",
      },
      badgeId: "badge-first-query",
      clueId: "clue-guest-list",
      successDialogue: ["\"Ten names. Ten alibis. Somebody's lying.\""],
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /select/i)) {
          return { success: false, message: "Your query needs to start with SELECT." };
        }
        if (!sqlHas(sql, /from\s+people/i)) {
          return { success: false, message: "You need to read FROM the people table." };
        }
        if (result.rowCount !== 10) {
          return {
            success: false,
            message: `Expected all 10 guests, but got ${result.rowCount}. Don't filter anything out yet.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "Empty room. That's not right — everyone was here.";
        if (result.rowCount === 10) return "Ten guests. One missing diamond.";
        return `${result.rowCount} guests so far — the rest are still out there.`;
      },
    },
    {
      id: "task-where",
      concept: "WHERE",
      chiefIntro: ["\"Who stands out? Security already flagged a few.\""],
      detectiveQuestion: "Who deserves a closer look?",
      chiefLine: "Not everyone at the gala matters. Find the ones marked suspicious.",
      evidenceAvailable: "Guest List",
      relevantTables: ["people"],
      instructions: "Find the suspicious guests.",
      starterSql: "-- Write your query below\n",
      hints: {
        detective: "Focus only on people marked suspicious.",
        data: "You need a WHERE clause.",
        sql: "SELECT *\nFROM people\nWHERE suspicious = true;",
      },
      badgeId: "badge-filter-master",
      clueId: "clue-suspect-shortlist",
      successDialogue: ["\"Three names: Kane, Webb, Reilly. All three near the vault.\""],
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /where/i)) {
          return { success: false, message: "Add a WHERE clause to filter the rows." };
        }
        if (!sqlHas(sql, /suspicious/i)) {
          return { success: false, message: "Filter on the suspicious column." };
        }
        if (result.rowCount === 0) {
          return { success: false, message: "That filter returned nobody. Check your condition." };
        }
        if (result.rowCount >= 10) {
          return { success: false, message: "That's everyone — your filter isn't narrowing anything down." };
        }
        const allSuspicious = result.rows.every(
          (r) => r.suspicious === true || r.suspicious === 1
        );
        if (!allSuspicious) {
          return { success: false, message: "Some of these guests aren't actually flagged suspicious." };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "Nobody stands out yet.";
        if (result.rowCount === 3) return "Three names deserve a closer look.";
        return `${result.rowCount} names raise a flag here.`;
      },
    },
    {
      id: "task-orderby",
      concept: "ORDER BY",
      chiefIntro: ["\"Witnesses lie about time. Databases don't. Rebuild the timeline.\""],
      detectiveQuestion: "Who was seen last?",
      chiefLine: "Witnesses lie about time. Databases don't. Rebuild the timeline.",
      evidenceAvailable: "Guest Timeline",
      relevantTables: ["people"],
      instructions: "Rebuild the timeline.",
      starterSql: "-- Write your query below\n",
      hints: {
        detective: "Sort the guests by when they were last seen.",
        data: "Use ORDER BY with last_seen_time.",
        sql: "SELECT *\nFROM people\nORDER BY last_seen_time DESC;",
      },
      badgeId: "badge-lead-detective",
      clueId: "clue-security-footage",
      successDialogue: [
        "\"Kane. Last one still in the building.\"",
        "\"He told the front desk he was in the garden all night. The data puts him in the vault room at 11:45.\"",
      ],
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /order\s+by\s+last_seen_time/i)) {
          return { success: false, message: "Use ORDER BY last_seen_time to rebuild the timeline." };
        }
        if (result.rowCount === 0) {
          return { success: false, message: "No rows came back. Check the table and columns." };
        }
        if (!("last_seen_time" in (result.rows[0] ?? {}))) {
          return {
            success: false,
            message: "Select all columns (or at least last_seen_time) so we can see the timeline.",
          };
        }
        const direction = isSortedByKey(result.rows, "last_seen_time");
        if (!direction) {
          return { success: false, message: "The rows don't look sorted by last_seen_time yet." };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "No one to line up yet.";
        return "One guest stayed later than they claimed.";
      },
    },
  ],
  debrief: [
    "\"The timeline gives us probable cause.\"",
    "\"Kane said the garden. The data says the vault, 11:45.\"",
    "\"You did good work today.\"",
    "\"The city may never know your name.\"",
    "\"But they'll sleep a little easier tonight.\"",
  ],
  badgeOnComplete: "badge-case-closed-1",
  xpOnComplete: 50,
};

export const MISSIONS: Mission[] = [MISSION_1];
