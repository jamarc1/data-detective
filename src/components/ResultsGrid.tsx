"use client";

import { QueryResult } from "@/types";

interface ResultsGridProps {
  result: QueryResult | null;
  insight?: string | null;
}

export default function ResultsGrid({ result, insight }: ResultsGridProps) {
  return (
    <div className="noir-panel flex min-h-0 flex-1 flex-col rounded-lg p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">Results</h2>
        {result && !result.error && (
          <span className="font-mono text-[11px] text-foreground/40">{result.rowCount} row(s)</span>
        )}
      </div>

      {result && !result.error && (
        <p className="mb-2 px-1 font-noir text-[11px] uppercase tracking-widest text-accent-soft">
          Evidence Retrieved
        </p>
      )}

      <div aria-live="polite">
        {result && !result.error && insight && (
          <p className="mb-2 px-1 font-noir text-sm italic text-accent-soft/90">{insight}</p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-panel-border bg-black/20">
        {!result && (
          <p className="p-4 text-sm text-foreground/40">The archive is waiting. Run a query.</p>
        )}

        {result?.error && (
          <p className="p-4 text-sm text-danger">⚠ {result.error}</p>
        )}

        {result && !result.error && result.rows.length === 0 && (
          <p className="p-4 text-sm text-foreground/40">No rows returned.</p>
        )}

        {result && !result.error && result.rows.length > 0 && (
          <table aria-label="Query results" className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#131a2b]">
              <tr>
                {result.columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="border-b border-panel-border px-3 py-2 font-mono text-xs uppercase tracking-wide text-accent-soft"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => {
                const isFlagged = row.suspicious === true || row.suspicious === 1;
                return (
                  <tr
                    key={i}
                    className={`hover:bg-accent/5 ${
                      isFlagged
                        ? "bg-red-900/20 border-l-2 border-red-600"
                        : "odd:bg-white/[0.02]"
                    }`}
                  >
                    {result.columns.map((col) => {
                      const cell = row[col];
                      return (
                        <td
                          key={col}
                          className={`border-b px-3 py-2 font-mono text-foreground/80 ${
                            isFlagged
                              ? "border-red-600/40 text-red-200"
                              : "border-panel-border/60"
                          }`}
                        >
                          {cell === null || cell === undefined ? "" : String(cell)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
