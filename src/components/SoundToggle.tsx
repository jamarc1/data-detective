"use client";

import { useGameStore } from "@/store/gameStore";
import { setMuted } from "@/lib/sound";

export default function SoundToggle() {
  const soundMuted = useGameStore((s) => s.soundMuted);
  const toggleSound = useGameStore((s) => s.toggleSound);

  function handleClick() {
    setMuted(!soundMuted);
    toggleSound();
  }

  return (
    <button
      onClick={handleClick}
      title={soundMuted ? "Sound effects muted" : "Sound effects on"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-panel-border bg-black/20 text-lg transition hover:border-accent"
    >
      {soundMuted ? "🔇" : "🔊"}
    </button>
  );
}
