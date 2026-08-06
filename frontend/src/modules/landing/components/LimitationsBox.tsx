"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export function LimitationsBox() {
  return (
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
  );
}
