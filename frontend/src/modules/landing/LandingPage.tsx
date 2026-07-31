"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/modules/layout/Navbar";
import { CitationTraceOverlay } from "@/components/CitationTraceOverlay";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollStack, { ScrollStackItem } from "@/react-bits/ScrollStack";

export function LandingPage() {
  const [activeCitation, setActiveCitation] = useState<number | null>(12);
  const showcaseContainerRef = useRef<HTMLDivElement>(null);

  // States for Section 5 interactive demo
  const [demoQuery, setDemoQuery] = useState("");
  const [demoAnswer, setDemoAnswer] = useState<string | null>(null);
  const [demoSource, setDemoSource] = useState<string | null>(null);

  const sampleQuestions = [
    "What causes high blood pressure?",
    "Is a mild fever in a toddler serious?",
    "What's the recommended dosage range for paracetamol?",
  ];

  const prewrittenAnswers: Record<string, { answer: string; source: string }> = {
    "What causes high blood pressure?": {
      answer: "High blood pressure is primarily caused by lifestyle factors (excess sodium, lack of physical activity, alcohol consumption) and underlying genetic predispositions. Over time, this strains the heart and blood vessels.",
      source: "Checked against a medical reference — p.38",
    },
    "Is a mild fever in a toddler serious?": {
      answer: "A mild fever (below 101°F/38.3°C) in a toddler is usually not serious and is often a sign the body is fighting a minor infection. However, if the fever persists past 3 days or is accompanied by lethargy, it should be checked by a pediatrician.",
      source: "Checked against a medical reference — p.18",
    },
    "What's the recommended dosage range for paracetamol?": {
      answer: "For adults, the typical dosage is 500mg to 1000mg every 4 to 6 hours as needed, not exceeding 4000mg (4g) in a 24-hour period. Overdosage can cause severe liver damage.",
      source: "Checked against a medical reference — p.84",
    },
  };

  const handleRunDemo = (query: string) => {
    setDemoQuery(query);
    const result = prewrittenAnswers[query];
    if (result) {
      setDemoAnswer(result.answer);
      setDemoSource(result.source);
    } else {
      setDemoAnswer("I couldn't find a clear answer to that in my references. Please check with a doctor for anything specific to your situation.");
      setDemoSource("No matching guideline found");
    }
  };

  const handleSubmitDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    handleRunDemo(demoQuery);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in hero elements on mount
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.fromTo(".hero-badge", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(".hero-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
          .fromTo(".hero-sub", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
          .fromTo(".hero-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
          .fromTo(".hero-visual", { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.5");

    // Scroll Trigger reveals for Section 3 Scenario Cards
    gsap.fromTo(".scenario-card", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#how-it-helps",
          start: "top 85%",
        }
      }
    );

    // Scroll Trigger reveals for Section 4 Trust elements
    gsap.fromTo(".trust-text",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".trust-section",
          start: "top 85%",
        }
      }
    );
    gsap.fromTo(".trust-proof",
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".trust-section",
          start: "top 85%",
        }
      }
    );

    // Scroll Trigger reveals for Section 5 Try it
    gsap.fromTo(".try-container",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".try-section",
          start: "top 85%",
        }
      }
    );

    // Scroll Trigger reveals for Section 6 Disclaimer
    gsap.fromTo(".disclaimer-box",
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".disclaimer-section",
          start: "top 85%",
        }
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--void)] flex flex-col selection:bg-[var(--violet-dim)] selection:text-[var(--ink)] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--violet)]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--verify)]/5 blur-[120px] pointer-events-none" />

      <Navbar activePage="home" />

      <main className="flex-1 w-full relative z-10 flex flex-col gap-28">
        
        {/* Section 2 — Hero */}
        <section className="max-w-7xl w-full mx-auto px-6 pt-32 pb-16 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            <div className="hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--surface-raised)] border border-white/5 text-mono text-[11px] text-[var(--verify)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--verify)] shadow-[0_0_8px_var(--verify)]" />
              <span className="font-semibold tracking-wider uppercase font-mono">A second opinion you can check.</span>
            </div>

            <h1 className="hero-title text-4xl sm:text-5xl lg:text-[54px] font-display font-semibold tracking-tight leading-[1.08] text-left">
              Ask a health question. <br />
              <span className="text-gradient">Get an answer you can trust.</span>
            </h1>

            <p className="hero-sub text-[var(--ink-dim)] text-base sm:text-lg max-w-[56ch] leading-relaxed text-left">
              Every answer comes from real medical references — not a guess. If we're not sure, we tell you, instead of pretending.
            </p>

            <div className="hero-cta">
              <Link href="/chat" className="btn-primary text-center font-display text-sm py-3.5 px-8 rounded-full">
                Ask a question
              </Link>
            </div>
          </div>

          {/* Right Column (45% Showcase overlay) */}
          <div className="hero-visual lg:col-span-5 flex flex-col gap-4 relative py-12" ref={showcaseContainerRef}>
            <div className="text-mono text-xs text-[var(--ink-faint)] flex items-center justify-between font-mono px-2">
              <span>ACTIVE CLINICAL RESPONSE</span>
              <span className="text-[var(--verify)]">Checked against a medical reference</span>
            </div>

            <CitationTraceOverlay
              containerRef={showcaseContainerRef}
              activeCitationId={activeCitation}
              citationSelectorPrefix="hero-cite-"
              sourceSelectorPrefix="hero-source-"
            />

            <div className="surface p-6 flex flex-col gap-5 shadow-2xl rounded-[12px] relative bg-[var(--surface)]/90 backdrop-blur-md">
              <div className="message-user text-xs leading-relaxed text-[var(--ink)]">
                What is the diagnostic threshold for essential hypertension?
              </div>

              <div className="message-ai text-xs leading-relaxed flex flex-col gap-3">
                <p>
                  Essential hypertension is diagnosed when persistent systolic blood pressure
                  exceeds 130 mmHg or diastolic blood pressure exceeds 80 mmHg across two separate clinical readings
                  {" "}
                  <span
                    id="hero-cite-12"
                    onClick={() => setActiveCitation(12)}
                    className={`citation-index cursor-pointer px-1 py-0.5 rounded transition-all ${
                      activeCitation === 12 ? "bg-[var(--verify-dim)] font-semibold shadow-[0_0_8px_rgba(61,217,180,0.2)] text-[var(--verify)]" : "text-[var(--verify)] bg-[var(--verify-dim)]/50"
                    }`}
                  >
                    See where this came from
                  </span>.
                </p>
              </div>

              {/* Source Passage Overlay Display */}
              <div className="mt-2 pt-4 border-t border-[var(--border-color)]">
                <div
                  id="hero-source-12"
                  className={`p-3.5 rounded-[6px] border transition-all duration-300 ${
                    activeCitation === 12
                      ? "bg-[var(--surface-raised)] border-[var(--verify)] shadow-md"
                      : "bg-[var(--void)] border-[var(--border-color)] opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-mono text-[11px] mb-1.5 font-mono">
                    <span className="text-[var(--verify)] font-semibold">ICD-11 Guideline BA00.0</span>
                    <span className="text-[var(--ink-faint)]">Page 142</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-dim)] leading-normal font-mono">
                    "...systolic blood pressure (SBP) ≥130 mmHg and/or diastolic blood pressure (DBP) ≥80 mmHg confirmed over ≥2 clinical visits."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Who it's for */}
        <section id="how-it-helps" className="max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-mono text-xs text-[var(--verify)] uppercase tracking-wider font-mono">
              Built for three very different moments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scenario A: Patient */}
            <div className="scenario-card surface p-8 flex flex-col justify-between gap-8 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-md min-h-[300px]">
              <div className="flex flex-col gap-4">
                <div className="text-xs text-[var(--ink-faint)] font-mono uppercase tracking-wider">For anyone with a health worry</div>
                <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                  "Should I be worried about this headache?"
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-dim)] leading-relaxed bg-[var(--surface)] p-4 rounded-lg border border-white/[0.03]">
                  "Most headaches like this aren't serious, but one that's sudden, severe, or paired with vision changes should be checked right away. Rest, water, and a pain reliever usually help with the common kind. If it doesn't ease up in a day, it's worth seeing a doctor."
                </p>
              </div>
              <div className="text-[10px] text-mono text-[var(--verify)] font-mono">
                Checked against a medical reference — p.12
              </div>
            </div>

            {/* Scenario B: Clinician */}
            <div className="scenario-card surface p-8 flex flex-col justify-between gap-8 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-md min-h-[300px]">
              <div className="flex flex-col gap-4">
                <div className="text-xs text-[var(--ink-faint)] font-mono uppercase tracking-wider">For people who work in healthcare</div>
                <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                  "What's the staging for hypertension?"
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-dim)] leading-relaxed bg-[var(--surface)] p-4 rounded-lg border border-white/[0.03]">
                  "Stage 1 is typically 130–139 systolic or 80–89 diastolic. Stage 2 is 140+ or 90+. Readings above 180/120 need immediate attention."
                </p>
              </div>
              <div className="text-[10px] text-mono text-[var(--verify)] font-mono">
                Checked against a medical reference — p.114 · view full passage
              </div>
            </div>

            {/* Scenario C: Student */}
            <div className="scenario-card surface p-8 flex flex-col justify-between gap-8 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-md min-h-[300px]">
              <div className="flex flex-col gap-4">
                <div className="text-xs text-[var(--ink-faint)] font-mono uppercase tracking-wider">For students studying medicine or health sciences</div>
                <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                  "Explain the difference between Type 1 and Type 2 diabetes."
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-dim)] leading-relaxed bg-[var(--surface)] p-4 rounded-lg border border-white/[0.03]">
                  "Type 1 is an autoimmune condition where the body stops producing insulin, usually starting young, and needs insulin treatment from diagnosis. Type 2 develops when the body resists or under-produces insulin, is more common in adults, and can often be managed through lifestyle changes before medication is needed. Both raise blood sugar, but the cause and treatment differ."
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] text-mono text-[var(--verify)] font-mono">
                  Checked against a medical reference — p.58 · view full passage
                </div>
                <div className="text-[9px] text-[var(--ink-faint)] leading-normal">
                  Good for revision and understanding concepts — always cross-check against your course material for exams.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Retrieval Pipeline Cards (ScrollStack Layout) */}
        <section className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-12">
          <div className="flex flex-col gap-3 text-center items-center">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              How Ayushman-AI verifies information
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-dim)] max-w-[60ch]">
              Instead of guessing or generating unsupported answers, Ayushman-AI matches your query against clinical guidelines.
            </p>
          </div>

          <ScrollStack itemDistance={36} itemStackDistance={24} itemScale={0.04} blurAmount={2}>
            {/* Card 1: Semantic Search */}
            <ScrollStackItem>
              <div className="surface p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-xl min-h-[200px]">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <span className="tag font-mono text-[10px] text-[var(--verify)] border border-[var(--verify)]/20 px-2.5 py-1 rounded uppercase w-fit">01 · Retrieve</span>
                  <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                    Cosine Similarity Matching
                  </h3>
                  <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
                    A vector search indexes the standard medical database using sentence embeddings. The platform extracts target documentation passages related to your active queries prior to writing the response.
                  </p>
                </div>
                <div className="p-4 rounded bg-black/40 border border-white/[0.04] text-mono text-[10px] flex flex-col gap-2 font-mono shrink-0 w-full sm:w-[240px]">
                  <div className="flex items-center justify-between text-[var(--verify)]">
                    <span>KDIGO_BP_CHUNKS [7]</span>
                    <span>SIMILARITY: 0.892</span>
                  </div>
                  <div className="text-[var(--ink-dim)] truncate">
                    &gt; Metformin dosage thresholds adjusted...
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 2: Boundary Verification */}
            <ScrollStackItem>
              <div className="surface p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-xl min-h-[200px]">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <span className="tag font-mono text-[10px] text-[var(--verify)] border border-[var(--verify)]/20 px-2.5 py-1 rounded uppercase w-fit">02 · Ground</span>
                  <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                    Strict Passage Boundary
                  </h3>
                  <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
                    The retrieval engine loads standard guides directly into context windows. Safety filters prevent model hallucination by ensuring answers are exclusively generated from these retrieved passages.
                  </p>
                </div>
                <div className="p-4 rounded bg-black/40 border border-white/[0.04] text-mono text-[10px] flex flex-col gap-2 font-mono shrink-0 w-full sm:w-[240px]">
                  <div className="flex items-center justify-between text-[var(--violet)]">
                    <span>SOURCE BOUNDARIES</span>
                    <span>VERIFIED</span>
                  </div>
                  <div className="text-[var(--ink-dim)] truncate">
                    [SYSTEM INSTRUCTION: Answer ONLY from context]
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 3: Citation Generation */}
            <ScrollStackItem>
              <div className="surface p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-2xl shadow-xl min-h-[200px]">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <span className="tag font-mono text-[10px] text-[var(--verify)] border border-[var(--verify)]/20 px-2.5 py-1 rounded uppercase w-fit">03 · Cite</span>
                  <h3 className="text-lg font-display font-semibold text-[var(--ink)]">
                    Dynamic Page-Level Maps
                  </h3>
                  <p className="text-xs text-[var(--ink-dim)] leading-relaxed">
                    Every key diagnostic index carries an active citation routing index. Clinicians can click the numbers to trace references back to precise source pages.
                  </p>
                </div>
                <div className="p-4 rounded bg-black/40 border border-white/[0.04] text-mono text-[10px] flex flex-col gap-2 font-mono shrink-0 w-full sm:w-[240px]">
                  <div className="flex items-center justify-between text-[var(--verify)]">
                    <span>ICD-11_GUIDELINE_BA00.PDF</span>
                    <span>PAGE: 142</span>
                  </div>
                  <div className="text-[var(--ink-dim)] truncate">
                    &gt; Citation trace [12] connects...
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </section>

        {/* Section 4 — Why it's different */}
        <section className="trust-section max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="trust-text lg:col-span-7 flex flex-col items-start gap-4">
            <span className="text-mono text-xs text-[var(--verify)] uppercase tracking-wider font-mono">
              The one thing that matters
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[var(--ink)]">
              It doesn't guess. <br />And if it's not sure, it says so.
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-dim)] max-w-[56ch] leading-relaxed">
              Most AI tools will answer anything you ask, even when they're making it up. Ayushman-AI only answers from real medical material — and when it can't find a good match, it tells you plainly instead of inventing something that sounds confident.
            </p>
          </div>

          <div className="trust-proof lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs text-[var(--ink-faint)] font-mono uppercase tracking-wider px-2">Live proof (low-confidence fallback)</div>
            <div className="surface p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] flex flex-col gap-4">
              <div className="text-xs text-[var(--ink-dim)] italic">"Is there a medical protocol to cure this custom symptoms strain?"</div>
              <div className="p-4 rounded-lg bg-[var(--void)] border border-red-500/20 text-xs text-red-400 font-mono leading-relaxed">
                "I couldn't find a clear answer to that in my references. Please check with a doctor for anything specific to your situation."
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 — Try it */}
        <section className="try-section max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-8 items-center text-center">
          <div className="flex flex-col gap-3">
            <span className="text-mono text-xs text-[var(--verify)] uppercase tracking-wider font-mono">
              Try it now
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
              Ask something. See how it answers.
            </h2>
          </div>

          <form onSubmit={handleSubmitDemo} className="try-container w-full flex flex-col gap-4">
            <div className="relative w-full flex items-center bg-[var(--surface)] border border-[var(--border-color)] rounded-full px-6 py-4 shadow-md focus-within:border-[var(--violet)] transition-colors duration-200">
              <input
                type="text"
                placeholder="Ask a medical scenario or symptom detail..."
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none pr-16"
              />
              <button
                type="submit"
                className="absolute right-3 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
              >
                Ask
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRunDemo(q)}
                  className="text-xs text-[var(--ink-dim)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] border border-[var(--border-color)] px-4 py-2 rounded-full transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>

          {/* Interactive response output box */}
          {demoAnswer && (
            <div className="w-full surface p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-color)] text-left flex flex-col gap-3 transition-all duration-300">
              <div className="text-xs font-mono text-[var(--verify)] font-medium">
                {demoSource}
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                {demoAnswer}
              </p>
            </div>
          )}
        </section>

        {/* Section 6 — What this is not */}
        <section className="disclaimer-section max-w-7xl w-full mx-auto px-6 py-12">
          <div className="disclaimer-box surface p-12 bg-[var(--surface-raised)] border border-red-500/10 rounded-[20px] shadow-2xl flex flex-col items-center justify-center text-center gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[var(--surface)] border border-red-500/20 text-mono text-xs text-red-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span>What Ayushman-AI is — and isn't</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--ink-dim)] max-w-[56ch] leading-relaxed">
              Ayushman-AI is a tool for understanding health information more clearly, backed by real medical references instead of guesswork. It is not a diagnosis, and it doesn't replace a doctor. For anything urgent, or specific to your own health, please see a qualified professional.
            </p>
          </div>
        </section>

        {/* Section 7 — Footer */}
        <footer className="max-w-7xl w-full mx-auto px-6 py-16 flex flex-col gap-12 text-sm text-[var(--ink-dim)] hairline-t">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-display font-semibold text-[15px] text-[var(--ink)]">Ayushman-AI</span>
              <p className="text-xs text-[var(--ink-faint)]">Answers grounded in real medical references.</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-mono font-mono text-[var(--ink-faint)]">
              <a href="#how-it-helps" className="hover:text-[var(--ink)] transition-colors">How it helps</a>
              <Link href="/chat" className="hover:text-[var(--ink)] transition-colors">Try it</Link>
              <Link href="/login" className="hover:text-[var(--ink)] transition-colors">Log in</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-mono text-[var(--ink-faint)] gap-4 font-mono">
            <span>© 2026 Ayushman-AI · Not a substitute for professional medical advice.</span>
            <span className="text-[10px] text-right max-w-[40ch] leading-normal">
              Built on verified medical guides including regional protocols and standard reference guidelines.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
