"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLE_SCHEMAS } from "@/lib/seedData";
import { useGameStore } from "@/store/gameStore";
import { playSound } from "@/lib/sound";

interface SidebarProps {
  onInsertQuery: (sql: string) => void;
}

const fieldListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const fieldItemVariants = {
  hidden: { opacity: 0, y: -4 },
  show: { opacity: 1, y: 0 },
};

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
        Case Files
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {TABLE_SCHEMAS.map((table) => {
          const isOpen = openTable === table.name;
          const isSelected = selectedTable === table.name;
          return (
            <div
              key={table.name}
              className={`rounded-md border transition-colors duration-300 ${
                isSelected ? "border-accent" : "border-panel-border"
              } bg-black/20`}
            >
              <button
                onClick={() => setOpenTable(isOpen ? null : table.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="flex flex-col">
                  <span
                    className={
                      table.caseName
                        ? "font-noir text-xs uppercase tracking-widest text-accent"
                        : "font-mono text-sm text-foreground/90"
                    }
                  >
                    {table.caseName ?? table.name}
                  </span>
                  {table.caseName && (
                    <span className="font-mono text-[10px] text-foreground/40">
                      Table: {table.name}
                    </span>
                  )}
                </span>
                <span className="text-xs text-foreground/40">{isOpen ? "▾" : "▸"}</span>
              </button>

              {!isOpen && table.caseName && (
                <p className="px-3 pb-2 text-[11px] italic text-foreground/30">Tap to inspect.</p>
              )}

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
                      <p className="px-3 pt-1 text-xs italic text-foreground/60">{table.tagline}</p>
                    )}
                    {table.contains && (
                      <motion.ul
                        variants={fieldListVariants}
                        initial="hidden"
                        animate="show"
                        className="px-3 pb-1 pt-1 text-xs text-foreground/70"
                      >
                        <p className="mb-1 text-[11px] uppercase tracking-widest text-foreground/40">
                          Contains
                        </p>
                        {table.contains.map((item) => (
                          <motion.li key={item} variants={fieldItemVariants}>
                            • {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                    <p className="px-3 pb-2 text-xs text-foreground/50">{table.description}</p>
                    <motion.ul
                      variants={fieldListVariants}
                      initial="hidden"
                      animate="show"
                      className="px-3 pb-2 font-mono text-xs text-foreground/60"
                    >
                      {table.columns.map((col) => (
                        <motion.li
                          key={col.name}
                          variants={fieldItemVariants}
                          className="flex justify-between border-t border-panel-border/60 py-1"
                        >
                          <span>{col.name}</span>
                          <span className="text-accent-soft/70">{col.type}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePreview(table.name)}
                      className="mx-3 mb-2 rounded border border-accent-soft/40 px-2 py-1 text-xs text-accent-soft transition hover:bg-accent-soft/10"
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
    </aside>
  );
}
