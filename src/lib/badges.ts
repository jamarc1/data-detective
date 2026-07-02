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
};
