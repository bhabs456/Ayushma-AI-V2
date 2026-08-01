"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/modules/layout/Navbar";
import { CitationTraceOverlay } from "@/components/CitationTraceOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, ShieldAlert, Cpu, Sparkles, FileText } from "lucide-react";

export function LandingPage() {
  const [activeCitation, setActiveCitation] = useState<number | null>(12);
  const showcaseContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth fade-in for hero section elements
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.fromTo(".hero-badge", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(".hero-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
          .fromTo(".hero-sub", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
          .fromTo(".hero-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
          .fromTo(".hero-visual", { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.5");

    // Reveal animations for cards and sections
    gsap.fromTo(".scenario-card", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#who-uses-it",
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(".step-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#how-it-works",
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--void)] flex flex-col selection:bg-[var(--verify-dim)] selection:text-[var(--verify)] relative overflow-hidden">
      <Navbar activePage="home" />

      <main className="flex-1 w-full relative z-10 flex flex-col gap-24 md:gap-32">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden max-w-6xl w-full mx-auto px-6 pt-32 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Evidence Quality Pitch) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 relative z-10">
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface-raised)] border border-[var(--border-color)] text-[11px] text-[var(--verify)] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--verify)] animate-pulse" />
              <span>CLINICAL EVIDENCE GONE TRACEABLE</span>
            </div>

            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-display text-[var(--ink)] leading-[1.08] tracking-tight">
              Medical knowledge,<br />
              <span className="text-gradient">grounded at page-level.</span>
            </h1>

            <p className="hero-sub text-[var(--ink-dim)] text-base sm:text-lg max-w-[50ch] leading-relaxed">
              Ayushman-AI is an evidence-first RAG engine built for medical scholars, students, and professionals who cannot afford hallucinations. Every response maps to exact source literature coordinates.
            </p>

            <div className="hero-cta flex flex-wrap gap-4 items-center">
              <Link href="/chat" className="btn-primary flex items-center gap-2 rounded-lg font-medium text-sm">
                Open Clinical Sandbox <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-ghost rounded-lg text-sm">
                How we verify
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

        {/* SECTION 2: COMPARISON STRIP */}
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

        {/* SECTION 3: HOW IT WORKS */}
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

        {/* SECTION 4: WHO IT IS FOR */}
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



        {/* SECTION 6: LIMITATIONS & TRANSPARENCY */}
        <section className="max-w-4xl w-full mx-auto px-6 py-4">
          <div className="p-8 md:p-10 rounded-xl bg-orange-950/10 border border-orange-500/10 flex flex-col md:flex-row items-start gap-6">
            <span className="text-[var(--accent-warm)] bg-[var(--accent-warm-dim)] p-3 rounded-lg shrink-0 mt-1">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-[var(--ink)] font-body">Limitations & Intended Evaluation Boundary</h3>
              <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
                Ayushman-AI is an information synthesis assistant designed strictly to resolve clinical guideline reference data. It is not an alternative to licensed clinical decision-making, diagnosis, or therapeutic advice. Scholars and practitioners must check source literature coordinates before making decisions.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-8 text-xs text-[var(--ink-dim)] border-t border-[var(--border-color)] font-mono">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-[var(--ink)] font-body">Ayushman.AI</span>
              <p className="text-[var(--ink-faint)]">Page-level reference grounding for medical search.</p>
            </div>

            <div className="flex items-center gap-6 text-[var(--ink-faint)]">
              <a href="#how-it-works" className="hover:text-[var(--ink)] transition-colors">How it works</a>
              <a href="#who-uses-it" className="hover:text-[var(--ink)] transition-colors">Use Cases</a>
              <Link href="/chat" className="hover:text-[var(--ink)] transition-colors">Workspace</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--ink-faint)] gap-4 pt-4 border-t border-white/[0.02]">
            <span>&copy; 2026 Ayushman-AI · Evidence-based research support engine.</span>
            <span>Guideline indices loaded: ADA, GINA, KDIGO, AHA, ACC</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
