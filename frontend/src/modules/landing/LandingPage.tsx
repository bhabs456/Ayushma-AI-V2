"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/modules/layout/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ComparisonStrip } from "./components/ComparisonStrip";
import { VerificationSteps } from "./components/VerificationSteps";
import { UseCaseGrid } from "./components/UseCaseGrid";
import { LimitationsBox } from "./components/LimitationsBox";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingPage() {
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
        <HeroSection />

        {/* COMPARISON STRIP */}
        <ComparisonStrip />

        {/* HOW IT WORKS */}
        <VerificationSteps />

        {/* WHO IT IS FOR */}
        <UseCaseGrid />

        {/* LIMITATIONS & TRANSPARENCY */}
        <LimitationsBox />

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
