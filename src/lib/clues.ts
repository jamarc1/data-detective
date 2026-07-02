import { Clue } from "@/types";

export const CLUE_CATALOG: Record<string, Clue> = {
  "clue-guest-list": {
    id: "clue-guest-list",
    title: "Guest List",
    description: "Every name that walked through the gala doors that night.",
    icon: "📋",
    revealHook: "Now we know exactly who was in the building that night.",
  },
  "clue-suspect-shortlist": {
    id: "clue-suspect-shortlist",
    title: "Suspect Shortlist",
    description: "Three guests flagged near the vault room before the diamond went missing.",
    icon: "🗂️",
    revealHook: "Now we know exactly who to watch.",
  },
  "clue-security-footage": {
    id: "clue-security-footage",
    title: "Security Footage",
    description: "Timestamps that put Victor Kane exactly where he shouldn't have been.",
    icon: "🎞️",
    revealHook: "Now we can see who was really near the vault.",
  },
};
