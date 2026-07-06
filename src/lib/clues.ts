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
  "clue-guest-staff-logs": {
    id: "clue-guest-staff-logs",
    title: "Guest & Staff Logs",
    description: "Badging records for everyone in The Hollow after soundcheck.",
    icon: "🎫",
    revealHook: "Now we know exactly who was in the building when Kai vanished.",
  },
  "clue-rideshare-contradiction": {
    id: "clue-rideshare-contradiction",
    title: "Rideshare Records",
    description: "Pickup logs showing the actual time Kai's rideshare arrived.",
    icon: "🚗",
    revealHook: "Now we know the staff timeline doesn't match the actual records.",
  },
  "clue-timeline-reconstructed": {
    id: "clue-timeline-reconstructed",
    title: "Complete Timeline",
    description: "The full night laid out chronologically from multiple sources.",
    icon: "⏳",
    revealHook: "Now we can see the gap in everyone's story.",
  },
  "clue-suspect-identified": {
    id: "clue-suspect-identified",
    title: "The Truth",
    description: "Who lied about when Kai left, and why that matters.",
    icon: "✓",
    revealHook: "Now we know who's lying, and we have the records to prove it.",
  },
};
