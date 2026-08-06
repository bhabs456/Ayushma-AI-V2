"use client";

import React from "react";

export function VerificationSteps() {
  return (
    <section id="how-it-works" className="max-w-6xl w-full mx-auto px-6 py-4 flex flex-col gap-12">
      <div className="flex flex-col gap-3 text-center items-center">
        <span className="text-xs text-[var(--verify)] font-mono tracking-widest uppercase">VERIFICATION ENGINE</span>
        <h2 className="text-3xl font-display text-[var(--ink)]">How information is grounded</h2>
        <p className="text-sm text-[var(--ink-dim)] max-w-[50ch] leading-relaxed">
          We replace generative guesswork with a deterministic retrieval boundary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="step-card surface p-6 flex flex-col gap-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--verify-dim)] text-[var(--verify)] flex items-center justify-center font-mono text-sm font-semibold border border-[var(--verify)]/20">
            01
          </div>
          <h3 className="text-base font-semibold text-[var(--ink)] font-body">Context Ingestion</h3>
          <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
            When you input a research inquiry, our system initiates a semantic search targeting peer-reviewed guidelines and verified textbooks.
          </p>
        </div>

        {/* Step 2 */}
        <div className="step-card surface p-6 flex flex-col gap-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--verify-dim)] text-[var(--verify)] flex items-center justify-center font-mono text-sm font-semibold border border-[var(--verify)]/20">
            02
          </div>
          <h3 className="text-base font-semibold text-[var(--ink)] font-body">Boundary Guarding</h3>
          <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
            The generative model is restricted to synthesize text exclusively using the retrieved clinical context. If no evidence matches, the filter triggers.
          </p>
        </div>

        {/* Step 3 */}
        <div className="step-card surface p-6 flex flex-col gap-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--verify-dim)] text-[var(--verify)] flex items-center justify-center font-mono text-sm font-semibold border border-[var(--verify)]/20">
            03
          </div>
          <h3 className="text-base font-semibold text-[var(--ink)] font-body">Source Resolution</h3>
          <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
            Every output chunk is tagged with its original PDF reference coordinate index, allowing instant page-level cross-examination.
          </p>
        </div>
      </div>
    </section>
  );
}
