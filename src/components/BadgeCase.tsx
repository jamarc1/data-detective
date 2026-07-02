"use client";

import { useState } from "react";
import { BADGE_CATALOG } from "@/lib/badges";
import { useGameStore } from "@/store/gameStore";

interface BadgeCaseProps {
  className?: string;
}

export default function BadgeCase({ className = "" }: BadgeCaseProps) {
  const earnedBadgeIds = useGameStore((s) => s.earnedBadgeIds);
  const [hovered, setHovered] = useState<string | null>(null);
  const allBadges = Object.values(BADGE_CATALOG);

  return (
    <div className={`noir-panel rounded-lg p-3 ${className}`}>
      <h2 className="mb-2 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        Badges
      </h2>
      <div className="flex flex-wrap gap-2 px-1">
        {allBadges.map((badge) => {
          const earned = earnedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              className="relative"
              onMouseEnter={() => setHovered(badge.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl transition ${
                  earned
                    ? "border-accent bg-accent/10 grayscale-0 opacity-100"
                    : "border-panel-border bg-black/20 grayscale opacity-40"
                }`}
              >
                {badge.icon}
              </div>
              {hovered === badge.id && (
                <div className="absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-md border border-panel-border bg-[#0d1322] p-2 text-center text-xs shadow-xl">
                  <p className="font-semibold text-accent-soft">{badge.name}</p>
                  <p className="mt-0.5 text-foreground/60">
                    {earned ? badge.description : "Not yet earned"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
