"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLE_SCHEMAS } from "@/lib/seedData";
import { runQuery } from "@/lib/duckdb";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

export default function WitnessFile() {
  const [openTable, setOpenTable] = useState<string | null>(null);
  const selectedTable = useGameStore((s) => s.selectedTable);
  const setSelectedTable = useGameStore((s) => s.setSelectedTable);
  const setLastQueryResult = useGameStore((s) => s.setLastQueryResult);
  const currentTaskIndex = useGameStore((s) => s.currentTaskIndex);

  async function handlePreview(name: string) {
    playSound("click");
    setSelectedTable(name);
    const result = await runQuery(`SELECT * FROM ${name} LIMIT 20;`);
    setLastQueryResult(result);
  }

  return (
    <div className="noir-panel flex flex-col rounded-lg p-3">
      <div className="flex flex-col gap-1">
        {TABLE_SCHEMAS.map((table) => {
          const gateIndex = table.taskIndex ?? 0;
          // Evidence stays locked until its lead comes up.
          if (currentTaskIndex < gateIndex) return null;

          const isOpen = openTable === table.name;
          const isSelected = selectedTable === table.name;

          return (
            <div key={table.name}>
              <button
                onClick={() => setOpenTable(isOpen ? null : table.name)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-1 py-2 text-left"
              >
                <div>
                  <h3 className="font-noir text-xs uppercase tracking-widest text-accent">
                    {table.caseName ?? table.name}
                  </h3>
                  {table.caseName && (
                    <p className="font-mono text-[10px] text-foreground/40">
                      {table.name}
                    </p>
                  )}
                </div>
                <span className="text-xs text-foreground/40 transition-transform" style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▾
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    {table.tagline && (
                      <p className="px-2 pt-1 pb-2 text-xs italic text-foreground/60">
                        {table.tagline}
                      </p>
                    )}
                    {table.contains && (
                      <div className="px-2 pb-2">
                        <p className="mb-1 text-[11px] uppercase tracking-widest text-foreground/40">
                          Contains
                        </p>
                        <ul className="text-xs text-foreground/70">
                          {table.contains.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="px-2 pb-2 text-xs text-foreground/50">{table.description}</p>

                    {/* Narrative field descriptions */}
                    <div className="px-2 pb-2 border-t border-panel-border/60">
                      {table.columns.map((col, idx) => (
                        <div
                          key={`${table.name}-${col.name}`}
                          className="py-2 border-b border-panel-border/40 last:border-b-0"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-xs text-accent-soft font-semibold flex-1">
                              {col.name}
                            </span>
                            <span className="text-[10px] text-foreground/30 whitespace-nowrap">
                              {col.type}
                            </span>
                          </div>
                          {col.narrative && (
                            <p className="mt-1 text-xs text-foreground/70">
                              {col.narrative}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePreview(table.name)}
                      className="mx-2 mb-2 w-[calc(100%-16px)] rounded border border-accent-soft/40 px-2 py-1 text-xs text-accent-soft transition hover:bg-accent-soft/10"
                    >
                      Preview rows ▸
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
