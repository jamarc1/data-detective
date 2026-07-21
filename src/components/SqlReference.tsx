"use client";

import { useState } from "react";

interface SqlKeyword {
  keyword: string;
  description: string;
  examples: string[];
}

const SQL_KEYWORDS: SqlKeyword[] = [
  {
    keyword: "SELECT",
    description: "Pick which columns to show",
    examples: ["SELECT * FROM people;", "SELECT id, name FROM people;"],
  },
  {
    keyword: "FROM",
    description: "Choose which table to read",
    examples: ["FROM people", "FROM crimes"],
  },
  {
    keyword: "WHERE",
    description: "Filter rows by a condition",
    examples: [
      "WHERE suspicious = true",
      "WHERE age > 25",
      "WHERE name LIKE '%maria%'",
    ],
  },
  {
    keyword: "ORDER BY",
    description: "Sort results ascending or descending",
    examples: [
      "ORDER BY last_seen_time DESC",
      "ORDER BY age ASC",
      "ORDER BY name",
    ],
  },
  {
    keyword: "JOIN",
    description: "Connect two tables on a shared key",
    examples: [
      "JOIN rideshare ON guest_name = passenger_name",
      "JOIN staff_shifts ON id = staff_id",
    ],
  },
];

export default function SqlReference() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(2); // WHERE expanded by default
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="flex flex-col gap-0 overflow-y-auto">
      {/* Header */}
      <div
        onClick={() => setPanelOpen(!panelOpen)}
        className="noir-panel cursor-pointer rounded-lg rounded-b-none border-b-0 py-3 px-4 transition hover:bg-foreground/5"
      >
        <div className="flex items-center justify-between">
          <p className="font-noir text-xs uppercase tracking-widest text-accent">
            SQL Reference
          </p>
          <span
            className={`text-xs transition ${panelOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--accent-soft)" }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {panelOpen && (
        <div className="flex flex-col gap-0 overflow-y-auto">
          {SQL_KEYWORDS.map((item, idx) => (
            <div
              key={idx}
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
              className={`noir-panel cursor-pointer border-t-0 py-3 px-4 transition hover:bg-foreground/5 ${
                idx === SQL_KEYWORDS.length - 1 ? "rounded-t-none rounded-b-lg" : "rounded-none"
              }`}
            >
              {/* Keyword */}
              <div
                className="mb-2 font-mono font-semibold text-xs"
                style={{ color: "var(--accent-gold)" }}
              >
                {item.keyword}
              </div>

              {/* Description */}
              <div className="mb-2 text-xs leading-relaxed text-foreground/70">
                {item.description}
              </div>

              {/* Examples (expanded) */}
              {expandedIndex === idx && (
                <div className="mt-3 space-y-1 rounded border border-foreground/10 bg-[#05070d] p-2">
                  {item.examples.map((example, exIdx) => (
                    <div
                      key={exIdx}
                      className="font-mono text-[10px] leading-relaxed text-accent-soft/80"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
