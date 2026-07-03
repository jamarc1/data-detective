"use client";

import { motion } from "framer-motion";
import { QueryResult } from "@/types";

interface ResultsGridProps {
  result: QueryResult | null;
  insight?: string | null;
  /** True once the just-run query is the correct answer for the current lead. */
  celebrate?: boolean;
}

export default function ResultsGrid({ result, insight, celebrate = false }: ResultsGridProps) {
  return (
    <motion.div
      animate={celebrate ? { scale: [1, 1.015, 1] } : undefined}
      transition={{ duration: 0.5 }}
      className={`noir-panel flex min-h-0 flex-1 flex-col rounded-lg p-3 ${
        celebrate ? "ring-1 ring-accent/50 shadow-[0_0_28px_rgba(217,164,65,0.2)]" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">Results</h2>
        {result && !result.error && (
          <span className="text-[11px] text-foreground/40">{result.rowCount} row(s)</span>
        )}
      </div>

      {celebrate && (
        <p className="mb-1 px-1 font-noir text-xs uppercase tracking-widest text-accent-soft">
          Evidence Retrieved
        </p>
      )}

      {result && !result.error && insight && (
        <p
          className={`mb-2 px-1 font-noir italic text-accent-soft/90 ${
            celebrate ? "text-base" : "text-sm"
          }`}
        >
          {insight}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-panel-border bg-black/20">
        {!result && (
          <p className="p-4 text-sm text-foreground/40">
            The archive is waiting. Run a query.
          </p>
        )}

        {result?.error && (
          <p className="p-4 text-sm text-danger">⚠ {result.error}</p>
        )}

        {result && !result.error && result.rows.length === 0 && (
          <p className="p-4 text-sm text-foreground/40">No rows returned.</p>
        )}

        {result && !result.error && result.rows.length > 0 && (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#131a2b]">
              <tr>
                {result.columns.map((col) => (
                  <th
                    key={col}
                    className="border-b border-panel-border px-3 py-2 font-mono text-xs uppercase tracking-wide text-accent-soft"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="odd:bg-white/[0.02] hover:bg-accent/5">
                  {result.columns.map((col) => {
                    const cell = row[col];
                    return (
                      <td key={col} className="border-b border-panel-border/60 px-3 py-2 font-mono text-foreground/80">
                        {cell === null || cell === undefined ? "" : String(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
