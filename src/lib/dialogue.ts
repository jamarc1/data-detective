// Short, in-character reactions Chief Marlowe can open with after a successful
// query, before delivering the case-specific line. Keeps the mentor feeling
// present and reactive instead of repeating the same beat every time.
export const DETECTIVE_FILLER_LINES: string[] = [
  "\"Interesting...\"",
  "\"I had a feeling.\"",
  "\"That changes things.\"",
  "\"Now we're getting somewhere.\"",
  "\"Good detectives don't stop at the first clue.\"",
  "\"Keep pulling that thread.\"",
  "\"That's the kind of lead I like.\"",
  "\"Something's starting to add up.\"",
  "\"Sharp eyes, Detective.\"",
  "\"The pieces are falling into place.\"",
  "\"That's not nothing.\"",
  "\"You're onto something.\"",
  "\"Hm. Didn't expect that.\"",
  "\"This case just got a little clearer.\"",
  "\"Nice catch.\"",
  "\"That's one more piece of the puzzle.\"",
  "\"You're thinking like a detective now.\"",
  "\"I knew this data was hiding something.\"",
  "\"Every good case starts with a detail like that.\"",
  "\"Don't stop there.\"",
];

/**
 * Picks a random filler line, avoiding an immediate repeat of `exclude`
 * (e.g. the line shown for the previous success) so it doesn't feel canned.
 */
export function pickFillerLine(exclude?: string): string {
  const pool = exclude
    ? DETECTIVE_FILLER_LINES.filter((line) => line !== exclude)
    : DETECTIVE_FILLER_LINES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Shown occasionally while the player is reviewing a successful query's
// results, before they click "Continue Investigation" — nudges them to
// actually look at the evidence instead of rushing to the next challenge.
export const REFLECTION_LINES: string[] = [
  "\"Take a minute. Every detail matters.\"",
  "\"Don't rush. Evidence tells stories.\"",
  "\"Read the records before making assumptions.\"",
  "\"The database always knows more than the witnesses.\"",
];

export function pickReflectionLine(exclude?: string): string {
  const pool = exclude
    ? REFLECTION_LINES.filter((line) => line !== exclude)
    : REFLECTION_LINES;
  return pool[Math.floor(Math.random() * pool.length)];
}

const REFLECTION_CHANCE = 0.65;

/** Marlowe only "occasionally" chimes in during evidence review — this rolls that chance. */
export function maybePickReflectionLine(exclude?: string): string | null {
  if (Math.random() >= REFLECTION_CHANCE) return null;
  return pickReflectionLine(exclude);
}
