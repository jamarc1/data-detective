export type SoundEffect =
  | "click"
  | "typewriter"
  | "queryRun"
  | "success"
  | "error"
  | "xp"
  | "badge"
  | "pageTurn";

const SOUND_FILES: Record<SoundEffect, string> = {
  click: "/sounds/click.mp3",
  typewriter: "/sounds/typewriter.mp3",
  queryRun: "/sounds/query-run.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  xp: "/sounds/xp.mp3",
  badge: "/sounds/badge.mp3",
  pageTurn: "/sounds/page-turn.mp3",
};

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

/**
 * Placeholder sound hook. No audio assets are bundled yet — this logs the
 * intended cue so effects can be wired up by dropping files into /public/sounds
 * and swapping this body for an Audio() play() call.
 */
export function playSound(effect: SoundEffect) {
  if (muted) return;
  if (typeof window === "undefined") return;
  console.debug(`[sound placeholder] ${effect} -> ${SOUND_FILES[effect]}`);
}
