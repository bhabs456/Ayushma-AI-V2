"use client";

import React from "react";
import { BookOpen, GraduationCap, Cpu } from "lucide-react";

export function UseCaseGrid() {
  return (
    <section id="who-uses-it" className="max-w-6xl w-full mx-auto px-6 py-4 flex flex-col gap-12">
      <div className="flex flex-col gap-3 text-left">
        <span className="text-xs text-[var(--verify)] font-mono tracking-widest uppercase">USE CASES</span>
        <h2 className="text-3xl font-display text-[var(--ink)]">Built for academic and clinical inquiry</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scholars & PhDs */}
        <div className="scenario-card surface p-6 flex flex-col gap-6 justify-between rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] min-h-[320px]">
          <div className="flex flex-col gap-4">
            <span className="text-[var(--verify)] flex items-center gap-2 font-mono text-xs">
              <BookOpen className="w-4 h-4" /> SCHOLARS & PHDS
            </span>
            <h3 className="text-lg font-semibold text-[var(--ink)] font-body leading-snug">
              Accelerating literature reviews with literal evidence extraction
            </h3>
            <p className="text-xs text-[var(--ink-dim)] leading-relaxed bg-[var(--void)]/40 p-4 rounded-lg border border-white/[0.02]">
              Retrieve exact diagnostic staging protocols across complex guidelines without manual page hunting or trusting summarized, generic Web summaries.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[var(--verify)]">
            Literature coordinates extracted automatically
          </span>
        </div>

        {/* Students */}
        <div className="scenario-card surface p-6 flex flex-col gap-6 justify-between rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] min-h-[320px]">
          <div className="flex flex-col gap-4">
            <span className="text-purple-400 flex items-center gap-2 font-mono text-xs">
              <GraduationCap className="w-4 h-4" /> ACADEMIC STUDENTS
            </span>
            <h3 className="text-lg font-semibold text-[var(--ink)] font-body leading-snug">
              Learning medicine with verifiable secondary opinions
            </h3>
            <p className="text-xs text-[var(--ink-dim)] leading-relaxed bg-[var(--void)]/40 p-4 rounded-lg border border-white/[0.02]">
              Cross-check clinical case study queries with official academic curricula. Read the exact text backing the advice to study accurately.
            </p>
          </div>
          <span className="text-[10px] font-mono text-purple-400">
            Ideal for clinical learning & revision support
          </span>
        </div>

        {/* Medical Professionals */}
        <div className="scenario-card surface p-6 flex flex-col gap-6 justify-between rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] min-h-[320px]">
          <div className="flex flex-col gap-4">
            <span className="text-[var(--accent-warm)] flex items-center gap-2 font-mono text-xs">
              <Cpu className="w-4 h-4" /> MEDICAL PROFESSIONALS
            </span>
            <h3 className="text-lg font-semibold text-[var(--ink)] font-body leading-snug">
              Rapid guideline reference inside complex clinical scenarios
            </h3>
            <p className="text-xs text-[var(--ink-dim)] leading-relaxed bg-[var(--void)]/40 p-4 rounded-lg border border-white/[0.02]">
              Query dose guidelines, therapeutic indexes, and contraindications. Every answer can be audited down to the source guidelines within seconds.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[var(--accent-warm)]">
            Reference guidelines: ADA, GINA, KDIGO, AHA
          </span>
        </div>
      </div>
    </section>
  );
}
