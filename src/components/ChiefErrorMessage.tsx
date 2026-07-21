"use client";

import { motion } from "framer-motion";
import { QueryResult } from "@/types";

interface ChiefErrorMessageProps {
  error: string | null;
  rowCount?: number;
  expectedRowCount?: number;
}

function detectErrorType(
  error: string,
  rowCount?: number,
  expectedRowCount?: number
): string | null {
  const lowerError = error.toLowerCase();

  // Missing table
  if (lowerError.includes("table") && lowerError.includes("not found")) {
    const match = error.match(/table ['"]([\w_]+)['"]/i);
    const tableName = match ? match[1] : "that table";
    return `Hold on — '${tableName}' doesn't ring a bell. Did you misspell the table name? Check the Evidence Available section.`;
  }

  // Missing column
  if (
    lowerError.includes("column") &&
    (lowerError.includes("not found") || lowerError.includes("unknown"))
  ) {
    const match = error.match(/column ['"]([\w_]+)['"]/i);
    const colName = match ? match[1] : "that column";
    return `'${colName}' isn't in this table. Check the Available Columns chips above — those are what you can use.`;
  }

  // Unclosed string/quote
  if (
    lowerError.includes("string") ||
    lowerError.includes("quote") ||
    lowerError.includes("unterminated")
  ) {
    return `Check your quotes — SQL needs them to match. Every ' needs a closing '.`;
  }

  // Syntax error (generic)
  if (lowerError.includes("syntax")) {
    return `Syntax error. Double-check: SELECT first, then FROM, then WHERE if you're filtering.`;
  }

  // Missing JOIN ON
  if (lowerError.includes("join") && lowerError.includes("on")) {
    return `You've got the JOIN keyword, but JOIN needs an ON clause to say which columns match. Try: ON table1.id = table2.id`;
  }

  // Row count mismatch (likely missing WHERE or filter)
  if (rowCount && expectedRowCount && rowCount > expectedRowCount) {
    return `You got ${rowCount} rows, but I expected ${expectedRowCount}. Are you missing a WHERE clause to narrow it down?`;
  }

  // Generic fallback
  return `Query didn't work. Check the Available Columns and Evidence section, and make sure your table name is spelled right.`;
}

export default function ChiefErrorMessage({
  error,
  rowCount,
  expectedRowCount,
}: ChiefErrorMessageProps) {
  if (!error) return null;

  const message = detectErrorType(error, rowCount, expectedRowCount);

  return (
    <motion.div
      key={error}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-md border border-danger/50 bg-danger/10 px-3 py-3"
    >
      <div className="mb-1 font-noir text-xs uppercase tracking-widest text-danger">
        ❌ Chief Reyes
      </div>
      <p className="text-sm italic text-foreground/70">"{message}"</p>
    </motion.div>
  );
}
