"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLE_SCHEMAS } from "@/lib/seedData";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface SidebarProps {
  onInsertQuery: (sql: string) => void;
  relevantTables?: string[];
  /** Table names unlocked so far. Undefined means "no restriction" (show everything). */
  unlockedTables?: string[];
  className?: string;
}

export default function Sidebar({
  onInsertQuery,
  relevantTables,
  unlockedTables,
  className = "",
}: SidebarProps) {
  const visibleSchemas = unlockedTables
    ? TABLE_SCHEMAS.filter((t) => unlockedTables.includes(t.name))
    : TABLE_SCHEMAS;
  const [open, setOpen] = useState(false);

  // The evidence relevant to the current lead should be the one already
  // expanded — reset back to it whenever the lead (and its relevant tables)
  // changes, so we don't leave a stale table open from a previous lead.
  const relevantKey = (relevantTables ?? []).join(",");
  const [trackedRelevantKey, setTrackedRelevantKey] = useState(relevantKey);
  const [openTable, setOpenTable] = useState<string | null>(relevantTables?.[0] ?? null);
  if (relevantKey !== trackedRelevantKey) {
    setTrackedRelevantKey(relevantKey);
    setOpenTable(relevantTables?.[0] ?? null);
  }

  const selectedTable = useGameStore((s) => s.selectedTable);
  const setSelectedTable = useGameStore((s) => s.setSelectedTable);

  function handlePreview(name: string) {
    playSound("click");
    setSelectedTable(name);
    onInsertQuery(`SELECT * FROM ${name} LIMIT 20;`);
  }

  const tableCount = visibleSchemas.length;
  const currentLabel = relevantTables && relevantTables.length > 0
    ? relevantTables
        .map((name) => {
          const schema = TABLE_SCHEMAS.find((t) => t.name === name);
          return schema ? `${schema.evidenceLabel} (${name})` : name;
        })
        .join(", ")
    : null;

  return (
    <aside className={`noir-panel flex h-full flex-col rounded-lg p-3 ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-2 flex w-full flex-col items-start gap-0.5 px-1 text-left"
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <h2 className="font-noir text-xs uppercase tracking-widest text-accent">
            Available Evidence
          </h2>
          <span className="text-[11px] text-foreground/40">{open ? "Hide ▾" : "▸"}</span>
        </div>
        {!open && (
          <>
            <p className="text-[11px] text-foreground/50">
              {tableCount} {tableCount === 1 ? "table" : "tables"} available
              {currentLabel ? ` · Current: ${currentLabel}` : ""}
            </p>
            <p className="text-[11px] text-foreground/40">Need table fields? Tap to view.</p>
          </>
        )}
      </button>
      {open && (
      <div className="flex flex-col gap-2 overflow-y-auto">
        {visibleSchemas.map((table) => {
          const isOpen = openTable === table.name;
          const isSelected = selectedTable === table.name;
          return (
            <div
              key={table.name}
              className={`rounded-md border ${
                isSelected ? "border-accent" : "border-panel-border"
              } bg-black/20`}
            >
              <button
                onClick={() => setOpenTable(isOpen ? null : table.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="flex flex-col">
                  <span className="text-sm text-foreground/90">{table.evidenceLabel}</span>
                  <span className="font-mono text-[11px] text-foreground/40">Table: {table.name}</span>
                </span>
                <span className="text-xs text-foreground/40">{isOpen ? "▾" : "▸"}</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-2 text-xs text-foreground/50">{table.description}</p>
                    <ul className="px-3 pb-2 font-mono text-xs text-foreground/60">
                      {table.columns.map((col) => (
                        <li key={col.name} className="flex justify-between border-t border-panel-border/60 py-1">
                          <span>{col.name}</span>
                          <span className="text-accent-soft/70">{col.type}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePreview(table.name)}
                      className="mx-3 mb-2 rounded border border-accent-soft/40 px-2 py-1 text-xs text-accent-soft transition hover:bg-accent-soft/10"
                    >
                      Preview rows ▸
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      )}
    </aside>
  );
}
