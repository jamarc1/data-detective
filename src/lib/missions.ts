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
    "\"Every investigation starts with the archive. Open the case file before you chase theories.\"",
  ],
  tasks: [
    {
      id: "task-crimes-select",
      concept: "SELECT",
      chiefIntro: [
        "\"What happened? That's where we start.\"",
        "\"Pull the case archive.\"",
      ],
      detectiveQuestion: "Which investigation is still active?",
      chiefLine:
        "Three investigations are sitting in our archive. Two have been closed. One is still costing this department time and money. Find it before we waste another day chasing ghosts.",
      evidenceAvailable: "Case Archive",
      instructions: "Open the case archive.",
      starterSql: "",
      hints: {
        detective: "Start with the case archive.",
        data: "The case archive is stored in the crimes table.",
        sql: "SELECT *\nFROM crimes;",
      },
      successDialogue: [
        "\"The Vantage Gala Heist. Still open — one suspect already flagged.\"",
        "\"Let's find out who was actually there.\"",
      ],
      chiefReaction: {
        clean: "Straight to the point. I like it.",
        standard: "That's all of them. Good work.",
        bruteForce: "You got there eventually.",
      },
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
        if (result.rowCount === 3) return "Three investigations remain. Only one is still active.";
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
      instructions: "Pull the guest list.",
      starterSql: "",
      hints: {
        detective: "Start with the guest list.",
        data: "The guest list lives in the people table.",
        sql: "SELECT *\nFROM people;",
      },
      badgeId: "badge-first-query",
      clueId: "clue-guest-list",
      successDialogue: ["\"Ten names. Ten alibis. Somebody's lying.\""],
      chiefReaction: {
        clean: "Clean query. Every guest accounted for.",
        standard: "That's the full guest list.",
        bruteForce: "There's all ten of them.",
      },
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
      instructions: "Find the suspicious guests.",
      starterSql: "",
      hints: {
        detective: "Focus only on people marked suspicious.",
        data: "You need a WHERE clause.",
        sql: "SELECT *\nFROM people\nWHERE suspicious = true;",
      },
      badgeId: "badge-filter-master",
      clueId: "clue-suspect-shortlist",
      successDialogue: ["\"Three names: Kane, Webb, Reilly. All three near the vault.\""],
      chiefReaction: {
        clean: "Efficient. You isolated exactly the right three.",
        standard: "Security's instincts were right. These three stand out.",
        bruteForce: "Eventually got the suspicious ones filtered out.",
      },
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
      instructions: "Rebuild the timeline.",
      starterSql: "",
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
      chiefReaction: {
        clean: "Timeline's crystal clear. Kane was the last one in that building.",
        standard: "There it is. Kane's alibi doesn't match the timeline.",
        bruteForce: "You got the timeline sorted. Kane's lying.",
      },
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

export const MISSION_2: Mission = {
  id: "mission-2",
  caseNumber: "Case No. 0128",
  title: "The Last Set",
  difficulty: "intermediate",
  briefing: [
    "Kai Rivera was due onstage at 11:00.",
    "Soundcheck ended at 9:40.",
    "Nobody's seen him since.",
    "The club's locked down — nobody in, nobody out — until we know where he went.",
  ],
  tasks: [
    {
      id: "task-last-set-where",
      concept: "WHERE",
      chiefIntro: [
        "\"Start with who was actually in the building after soundcheck.\"",
        "\"Pull everyone the scanners caught past 9:40.\"",
      ],
      detectiveQuestion: "Who was in the building after soundcheck?",
      chiefLine:
        "Start with who was actually in the building after soundcheck. Pull everyone the scanners caught past 9:40.",
      evidenceAvailable: "Guest Scans",
      instructions: "Find everyone in the building after 9:40 PM.",
      starterSql: "",
      hints: {
        detective: "Filter guest_scans where scan_time is after 9:40 PM.",
        data: "The guest scan logs are in the guest_scans table.",
        sql: "SELECT *\nFROM guest_scans\nWHERE scan_time > '21:40:00';",
      },
      badgeId: "badge-cross-reference",
      clueId: "clue-guest-staff-logs",
      successDialogue: [
        "\"Six people in the building after soundcheck.\"",
        "\"One of them isn't in this room right now.\"",
      ],
      chiefReaction: {
        clean:
          "Clean pull. Six people in the building after soundcheck. One of them isn't in this room right now.",
        standard:
          "Six names, all confirmed in the building. Now we find out which one is lying about it.",
        bruteForce:
          "You got there. Six names — next time, filter first instead of scrolling through all of them.",
      },
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /select/i)) {
          return { success: false, message: "Your query needs to start with SELECT." };
        }
        if (!sqlHas(sql, /from\s+guest_scans/i)) {
          return { success: false, message: "You need to read FROM the guest_scans table." };
        }
        if (!sqlHas(sql, /where/i)) {
          return { success: false, message: "Add a WHERE clause to filter by scan_time." };
        }
        if (!sqlHas(sql, /scan_time/i)) {
          return { success: false, message: "Filter on the scan_time column." };
        }
        if (result.rowCount !== 6) {
          return {
            success: false,
            message: `Expected 6 scans after 9:40 PM, but got ${result.rowCount}. Check your WHERE condition.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "No scans after 9:40. That can't be right.";
        if (result.rowCount === 6) return "Six scans after soundcheck. One is missing now.";
        return `${result.rowCount} scans so far — keep narrowing it down.`;
      },
    },
    {
      id: "task-last-set-join-1",
      concept: "JOIN",
      chiefIntro: [
        "\"Staff say Kai left in a rideshare at 10:15.\"",
        "\"Join the records and see if that timeline holds up.\"",
      ],
      detectiveQuestion: "When did the rideshare actually pick up Kai?",
      chiefLine:
        "Staff say Kai left in a rideshare at 10:15. Join the guest scans to the rideshare pickups and see if that timeline holds up.",
      evidenceAvailable: "Rideshare Logs",
      instructions: "Find the rideshare pickup for Kai and compare it to the staff timeline.",
      starterSql: "",
      hints: {
        detective: "Join guest_scans and rideshare_pickups to find Kai's pickup time.",
        data: "Match on the guest/passenger names, then check the times.",
        sql: "SELECT g.*, r.pickup_time\nFROM guest_scans g\nJOIN rideshare_pickups r ON g.guest_name = r.passenger_name\nWHERE g.guest_name = 'Kai Rivera';",
      },
      badgeId: "badge-alibi-breaker",
      clueId: "clue-rideshare-contradiction",
      successDialogue: [
        "\"The rideshare pulled up at 10:52, not 10:15.\"",
        "\"Whoever told you 10:15 was either wrong, or hoping you wouldn't check.\"",
      ],
      chiefReaction: {
        clean:
          "The rideshare pulled up at 10:52, not 10:15. Whoever told you 10:15 was either wrong, or hoping you wouldn't check.",
        standard:
          "The rideshare pulled up at 10:52, not 10:15. Whoever told you 10:15 was either wrong, or hoping you wouldn't check.",
        bruteForce:
          "Took a few tries, but you found it: the rideshare pulled up at 10:52, not 10:15. That thirty-seven minutes is the whole case.",
      },
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /join/i)) {
          return { success: false, message: "You need a JOIN to connect the guest scans and rideshare pickups." };
        }
        if (!sqlHas(sql, /guest_scans/i) || !sqlHas(sql, /rideshare_pickups/i)) {
          return { success: false, message: "Join guest_scans and rideshare_pickups together." };
        }
        if (result.rowCount !== 1) {
          return {
            success: false,
            message: `Expected 1 pickup record for Kai, but got ${result.rowCount}. Check your join condition.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "No rideshare pickup found for that name.";
        if (result.rowCount === 1) return "One pickup — at 10:52. That's not 10:15.";
        return `Found ${result.rowCount} records — narrow it down to just Kai's pickup.`;
      },
    },
    {
      id: "task-last-set-join-2",
      concept: "JOIN",
      chiefIntro: ["\"Now put the full night in order.\"", "\"Join all three logs and lay out where he actually was, minute by minute.\""],
      detectiveQuestion: "What's the complete timeline for the night?",
      chiefLine: "Now put the full night in order — join all three logs and lay out where he actually was, minute by minute.",
      evidenceAvailable: "Complete Timeline",
      instructions: "Reconstruct the timeline by joining all three logs ordered by time.",
      starterSql: "",
      hints: {
        detective: "You'll need guest_scans, staff_shifts, and rideshare_pickups all together.",
        data: "Join them all on matching names, then sort by time to see the sequence.",
        sql: "SELECT * FROM guest_scans\nUNION ALL SELECT * FROM staff_shifts\nUNION ALL SELECT * FROM rideshare_pickups\nORDER BY time;",
      },
      badgeId: null,
      clueId: "clue-timeline-reconstructed",
      successDialogue: [
        "\"There's the gap.\"",
        "\"Thirty-seven minutes nobody accounts for.\"",
        "\"That's not a mystery anymore — that's a window.\"",
      ],
      chiefReaction: {
        clean:
          "There's the gap. Thirty-seven minutes nobody accounts for. That's not a mystery anymore — that's a window.",
        standard:
          "There's the gap. Thirty-seven minutes nobody accounts for. That's not a mystery anymore — that's a window.",
        bruteForce:
          "You found the gap eventually. Thirty-seven minutes. Next time, build the timeline before you go looking for the hole in it.",
      },
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /join/i)) {
          return { success: false, message: "You need to join multiple tables to build the full timeline." };
        }
        if (!sqlHas(sql, /order\s+by/i)) {
          return { success: false, message: "Sort the timeline chronologically with ORDER BY." };
        }
        if (result.rowCount < 8) {
          return {
            success: false,
            message: `Expected at least 8 records in the full timeline, but got ${result.rowCount}.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "No timeline built yet.";
        return "The full night laid out. Now find the gap.";
      },
    },
    {
      id: "task-last-set-join-final",
      concept: "JOIN",
      chiefIntro: ["\"One person's story doesn't survive the timeline.\"", "\"Find them.\""],
      detectiveQuestion: "Who's lying about when Kai left?",
      chiefLine: "One person's story doesn't survive the timeline. Find them.",
      evidenceAvailable: "The Suspect",
      instructions: "Cross-reference the staff statements against the actual timeline to find who's lying.",
      starterSql: "",
      hints: {
        detective: "Find the staff member whose statement contradicts the rideshare logs.",
        data: "Join staff_shifts and rideshare_pickups, looking for mismatches in time.",
        sql: "SELECT s.* FROM staff_shifts s\nWHERE s.statement LIKE '%10:15%'\nAND NOT EXISTS (SELECT 1 FROM rideshare_pickups r WHERE r.pickup_time LIKE '22:15%');",
      },
      badgeId: "badge-set-list-solved",
      clueId: "clue-suspect-identified",
      successDialogue: ["\"Say the name.\"", "\"I want it on record before we bring him in.\""],
      chiefReaction: {
        clean: "Say the name. I want it on record before we bring him in.",
        standard: "Say the name. I want it on record before we bring him in.",
        bruteForce: "You got there. Say the name — I want it on record before we bring him in.",
      },
      validate: (sql: string, result: QueryResult) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /staff_shifts/i) || !sqlHas(sql, /rideshare_pickups/i)) {
          return {
            success: false,
            message: "Cross-reference the staff statements against the actual rideshare pickups — you need both tables.",
          };
        }
        if (!sqlHas(sql, /join/i)) {
          return { success: false, message: "Join the two tables together to compare them." };
        }
        if (result.rowCount !== 1) {
          return {
            success: false,
            message: `Expected to identify exactly 1 suspect, but got ${result.rowCount}.`,
          };
        }
        return { success: true };
      },
      resultInsight: (result) => {
        if (result.rowCount === 0) return "No suspect identified yet.";
        if (result.rowCount === 1) return "One story doesn't hold up. That's your answer.";
        return `Found ${result.rowCount} suspects — there should be only one.`;
      },
    },
  ],
  debrief: [
    "\"He never left the building.\"",
    "\"He just stopped being where he said he'd be.\"",
    "\"That's the part that should've scared us sooner.\"",
  ],
  badgeOnComplete: "badge-case-closed-2",
  xpOnComplete: 75,
};

export const MISSIONS: Mission[] = [MISSION_1, MISSION_2];

/** Looks up a mission by id, falling back to the first mission for unknown ids. */
export function getMissionById(id: string): Mission {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}
