"use client";

import { KeyboardEvent } from "react";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
  placeholder: string;
}

export default function SqlEditor({ value, onChange, onRun, running, placeholder }: SqlEditorProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  }

  return (
    <div className="noir-panel flex flex-col rounded-lg p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-noir text-xs uppercase tracking-widest text-accent">SQL Editor</h2>
        <span className="text-[11px] text-foreground/40">Ctrl/Cmd + Enter to run</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={6}
        className="w-full flex-1 resize-none rounded-md border border-panel-border bg-black/30 p-3 font-mono text-sm text-accent-soft outline-none focus:border-accent"
        placeholder={placeholder}
      />
      <button
        onClick={onRun}
        disabled={running}
        className="mt-2 self-end rounded-md bg-accent px-5 py-2 font-noir text-sm text-[#1a1305] transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? "Running..." : "Run Query ▸"}
      </button>
    </div>
  );
}
