"use client";

import { KeyboardEvent, useRef } from "react";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
  columns?: string[];
}

export default function SqlEditor({ value, onChange, onRun, running, columns = [] }: SqlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  }

  function insertColumn(column: string) {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + column + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + column.length;
      textarea.focus();
    }, 0);
  }

  return (
    <div className="flex flex-col rounded-lg p-3 border border-blue-500/40 bg-gradient-to-br from-slate-900/50 to-slate-950/50 shadow-lg shadow-blue-500/20">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-blue-400">SQL Editor</h2>
        <span className="text-[11px] text-foreground/40">⌘ + Enter to run</span>
      </div>
      {columns.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {columns.map((col) => (
            <button
              key={col}
              onClick={() => insertColumn(col)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
            >
              {col}
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={5}
        className="w-full resize-none rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-yellow-400 outline-none focus:border-blue-400"
        placeholder="-- Write a SQL query to identify the active investigation."
      />
      <div className="mt-2">
        <button
          onClick={onRun}
          disabled={running}
          className="w-full rounded-md bg-accent px-5 py-2 font-noir text-sm text-slate-900 transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "Running..." : "Run Query ▸"}
        </button>
      </div>
    </div>
  );
}
