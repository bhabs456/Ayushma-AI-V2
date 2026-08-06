"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export function ComparisonStrip() {
  return (
    <section className="border-y border-[var(--border-color)] bg-[var(--surface)]/40 py-8">
      <div className="max-w-6xl w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[var(--accent-warm)] bg-[var(--accent-warm-dim)] p-2 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)] font-body">The Hallucination Problem</h3>
            <p className="text-xs text-[var(--ink-dim)] mt-0.5">Generic chatbots summarize the web; they don't cite exact pages.</p>
          </div>
        </div>
        <div className="h-px w-full md:w-px md:h-10 bg-[var(--border-color)]" />
        <div className="flex items-center gap-6 text-xs font-mono text-[var(--ink-dim)]">
          <div>
            <span className="text-red-400 block font-semibold mb-1">ChatGPT / Claude</span>
            <span>Summarized medical advice (no coordinates)</span>
          </div>
          <span className="text-xl text-[var(--ink-faint)]">→</span>
          <div>
            <span className="text-[var(--verify)] block font-semibold mb-1">Ayushman.AI</span>
            <span>Page-level citation trace + literal matches</span>
          </div>
        </div>
      </div>
    </section>
  );
}
