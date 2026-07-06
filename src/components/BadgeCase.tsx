"use client";

import { BADGE_CATALOG } from "@/lib/badges";
import { useGameStore } from "@/store/gameStore";

interface BadgeCaseProps {
  className?: string;
}

export default function BadgeCase({ className = "" }: BadgeCaseProps) {
  const earnedBadgeIds = useGameStore((s) => s.earnedBadgeIds);
  const allBadges = Object.values(BADGE_CATALOG);

  return (
    <div className={`noir-panel rounded-lg p-3 ${className}`}>
      <h2 className="mb-3 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        Badges
      </h2>
      <div className="flex flex-col gap-2 px-1">
        {allBadges.map((badge) => {
          const earned = earnedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                earned
                  ? "border border-accent bg-accent/5"
                  : "border border-panel-border/40 bg-black/20 opacity-60 grayscale"
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                  earned
                    ? "border border-accent bg-accent/10"
                    : "border border-panel-border/40 bg-black/40"
                }`}
              >
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    earned ? "text-accent-soft" : "text-foreground/40"
                  }`}
                >
                  {badge.name}
                </p>
                <p className="text-xs leading-snug text-foreground/50 mt-0.5">
                  {earned ? badge.description : "Not yet earned"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
