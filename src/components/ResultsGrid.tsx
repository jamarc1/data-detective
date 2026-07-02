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
          <span className="text-[11px] text-foreground/40">{result.rowCount} row(s)</span>
        )}
      </div>

      {result && !result.error && insight && (
        <p className="mb-2 px-1 font-noir text-sm italic text-accent-soft/90">{insight}</p>
      )}

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-panel-border bg-black/20">
        {!result && (
          <p className="p-4 text-sm text-foreground/40">
            Run a query to see the evidence here.
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
    </div>
  );
}
