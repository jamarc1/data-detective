"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLE_SCHEMAS } from "@/lib/seedData";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface SidebarProps {
  onInsertQuery: (sql: string) => void;
}

export default function Sidebar({ onInsertQuery }: SidebarProps) {
  const [openTable, setOpenTable] = useState<string | null>(TABLE_SCHEMAS[0]?.name ?? null);
  const selectedTable = useGameStore((s) => s.selectedTable);
  const setSelectedTable = useGameStore((s) => s.setSelectedTable);

  function handlePreview(name: string) {
    playSound("click");
    setSelectedTable(name);
    onInsertQuery(`SELECT * FROM ${name} LIMIT 20;`);
  }

  return (
    <aside className="noir-panel flex h-full flex-col rounded-lg p-3">
      <h2 className="mb-2 px-1 font-noir text-xs uppercase tracking-widest text-accent">
        Database Tables
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {TABLE_SCHEMAS.map((table) => {
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
                <span className="font-mono text-sm text-foreground/90">{table.name}</span>
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
    </aside>
  );
}
