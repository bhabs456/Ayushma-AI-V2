"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText } from "lucide-react";
import { DirectionalText } from "@/components/DirectionalText";
import { CitationTraceOverlay } from "@/components/CitationTraceOverlay";

export function HeroSection() {
  const [activeCitation, setActiveCitation] = useState<number | null>(12);
  const showcaseContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative overflow-hidden max-w-6xl w-full mx-auto px-6 pt-32 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left Column (Evidence Quality Pitch) */}
      <div className="lg:col-span-7 flex flex-col items-start gap-6 relative z-10">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface-raised)] border border-[var(--border-color)] text-[11px] text-[var(--verify)] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--verify)] animate-pulse" />
          <span>CLINICAL EVIDENCE GONE TRACEABLE</span>
        </div>

        <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-display leading-[1.08] tracking-tight flex flex-col items-start gap-1">
          <DirectionalText activeColor="linear-gradient(135deg, #3DD9B4 0%, #2BC4A0 100%)" restingColor="var(--ink)" duration={450}>
            Medical knowledge,
          </DirectionalText>
          <DirectionalText activeColor="linear-gradient(135deg, #7C5CFF 0%, #3DD9B4 80%)" restingColor="linear-gradient(135deg, #3DD9B4 0%, #7C5CFF 80%)" duration={450}>
            grounded at page-level.
          </DirectionalText>
        </h1>

        <p className="hero-sub text-[var(--ink-dim)] text-base sm:text-lg max-w-[50ch] leading-relaxed">
          Ayushman-AI is an evidence-first RAG engine built for medical scholars, students, and professionals who cannot afford hallucinations. Every response maps to exact source literature coordinates.
        </p>

        <div className="hero-cta flex flex-wrap gap-4 items-center">
          <Link href="/chat" className="btn-primary flex items-center gap-2 rounded-lg font-medium text-sm">
            Open Clinical Sandbox <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-ghost rounded-lg text-sm">
            <DirectionalText activeColor="var(--ink)" restingColor="var(--ink-dim)" duration={350}>
              How we verify
            </DirectionalText>
          </a>
        </div>
      </div>

      {/* Right Column (Traceability Showcase Simulator) */}
      <div className="hero-visual lg:col-span-5 flex flex-col gap-3 relative z-10 py-8" ref={showcaseContainerRef}>
        <div className="text-mono text-[10px] text-[var(--ink-faint)] flex items-center justify-between font-mono px-2">
          <span>REFERENCE RESOLVER</span>
          <span className="text-[var(--verify)] flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> VERIFIED LINK
          </span>
        </div>

        <CitationTraceOverlay
          containerRef={showcaseContainerRef}
          activeCitationId={activeCitation}
          citationSelectorPrefix="hero-cite-"
          sourceSelectorPrefix="hero-source-"
        />

        <div className="surface p-6 flex flex-col gap-4 rounded-xl relative bg-[var(--surface)]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-dim)] border-b border-[var(--border-color)] pb-3">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>Scholar Query: Staging criteria for essential HTN</span>
          </div>

          <div className="message-ai text-[13px] leading-relaxed text-[var(--ink)]">
            <p>
              According to current international guidelines, essential hypertension is diagnosed at a diagnostic threshold of SBP ≥130 mmHg or DBP ≥80 mmHg confirmed across two separate outpatient clinical interactions
              {" "}
              <span
                id="hero-cite-12"
                onClick={() => setActiveCitation(activeCitation === 12 ? null : 12)}
                className={`citation-index cursor-pointer px-1.5 py-0.5 rounded transition-all font-mono text-[11px] ${
                  activeCitation === 12 
                    ? "bg-[var(--verify-dim)] text-[var(--verify)] border-[var(--verify)]/50" 
                    : "text-[var(--ink-dim)] bg-white/5 border-transparent"
                }`}
              >
                [Ref 12]
              </span>.
            </p>
          </div>

          {/* Source coordinates overlay */}
          <div className="mt-2 pt-3 border-t border-[var(--border-color)]">
            <div
              id="hero-source-12"
              className={`p-3.5 rounded-lg border transition-all duration-300 font-mono ${
                activeCitation === 12
                  ? "bg-[var(--surface-raised)] border-[var(--verify)] shadow-[0_0_15px_rgba(61,217,180,0.1)]"
                  : "bg-[var(--void)]/50 border-[var(--border-color)] opacity-40"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-[var(--verify)] font-semibold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> AHA/ACC Guideline
                </span>
                <span className="text-[var(--ink-faint)]">Page 142 · Table 3</span>
              </div>
              <p className="text-[11px] text-[var(--ink-dim)] leading-relaxed italic">
                "...systolic blood pressure (SBP) ≥130 mmHg and/or diastolic blood pressure (DBP) ≥80 mmHg confirmed over ≥2 clinical visits."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
