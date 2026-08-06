"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface StarterPrompt {
  label: string;
  query: string;
}

interface EmptyStateProps {
  starterPrompts: StarterPrompt[];
  handleSend: (queryToSend?: string) => void | Promise<void>;
}

export function EmptyState({ starterPrompts, handleSend }: EmptyStateProps) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center max-w-[620px] mx-auto gap-8 my-auto w-full">
      <div className="flex flex-col gap-2">
        <span className="font-display text-4xl font-normal text-[var(--ink)] tracking-tight font-serif">
          Ayushman<span className="text-[var(--verify)] font-mono text-sm font-semibold ml-1">AI</span>
        </span>
        <p className="text-sm text-[var(--ink-dim)] leading-relaxed font-body mt-1">
          Verifiable medical guidelines & reference tracing workspace.
        </p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="text-[9px] font-mono text-[var(--ink-faint)] uppercase tracking-wider text-left pl-1">
          Starter guideline queries
        </div>
        <div className="flex flex-col gap-2">
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--border-color)] text-xs text-[var(--ink-dim)] hover:text-[var(--ink)] text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <span className="truncate pr-4">{p.query}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--ink-faint)] group-hover:text-[var(--verify)] transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
