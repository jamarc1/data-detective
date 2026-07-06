import { Badge } from "@/types";

export const BADGE_CATALOG: Record<string, Badge> = {
  "badge-first-query": {
    id: "badge-first-query",
    name: "First Query",
    description: "Ran your very first SELECT statement.",
    icon: "🔍",
  },
  "badge-filter-master": {
    id: "badge-filter-master",
    name: "Filter Master",
    description: "Narrowed a room full of suspects down with WHERE.",
    icon: "🧩",
  },
  "badge-lead-detective": {
    id: "badge-lead-detective",
    name: "Lead Detective",
    description: "Sorted the evidence with ORDER BY.",
    icon: "🕵️",
  },
  "badge-case-closed-1": {
    id: "badge-case-closed-1",
    name: "Case Closed: The Vantage Heist",
    description: "Solved the Vantage Gala Heist from start to finish.",
    icon: "💎",
  },
  "badge-cross-reference": {
    id: "badge-cross-reference",
    name: "Cross Reference",
    description: "Cross-referenced the timeline with WHERE.",
    icon: "📋",
  },
  "badge-alibi-breaker": {
    id: "badge-alibi-breaker",
    name: "Alibi Breaker",
    description: "Broke an alibi by joining timeline logs.",
    icon: "🔗",
  },
  "badge-set-list-solved": {
    id: "badge-set-list-solved",
    name: "The Last Set",
    description: "Identified the truth behind Kai Rivera's disappearance.",
    icon: "🎭",
  },
  "badge-case-closed-2": {
    id: "badge-case-closed-2",
    name: "Case Closed: The Last Set",
    description: "Solved the mystery of Kai Rivera's missing 37 minutes.",
    icon: "⏱️",
  },
};
