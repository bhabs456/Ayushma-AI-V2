"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/modules/layout/Navbar";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[var(--void)] flex flex-col selection:bg-[var(--violet-dim)]">
      <Navbar activePage="login" />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        {/* Single Centered Auth Card */}
        <div className="surface w-full max-w-[400px] p-8 flex flex-col gap-6 bg-[var(--surface)] shadow-md">
          {/* Header & Plain Text Toggles */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6 hairline-b pb-3 text-sm font-display">
              <span className="text-[var(--ink)] font-semibold border-b-2 border-[var(--violet)] pb-3 -mb-3">
                Log in
              </span>
              <Link
                href="/signup"
                className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors pb-3 -mb-3"
              >
                Sign up
              </Link>
            </div>

            <p className="text-xs text-[var(--ink-dim)]">
              Enter your clinical credentials to access workspace datasets.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/chat";
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-mono text-xs text-[var(--ink-dim)] font-mono">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.sharma@hospital.org"
                className="text-sm bg-[var(--void)] text-[var(--ink)] placeholder-[var(--ink-faint)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-mono text-xs font-mono">
                <label className="text-[var(--ink-dim)]">Password</label>
                <a href="#" className="text-[var(--ink-faint)] hover:text-[var(--ink-dim)]">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="text-sm bg-[var(--void)] text-[var(--ink)] placeholder-[var(--ink-faint)]"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 font-display text-sm mt-2">
              Sign in to Workspace
            </button>
          </form>

          <div className="text-mono text-[11px] text-[var(--ink-faint)] text-center hairline-t pt-4 font-mono">
            Protected by Ayushman-AI Clinical Encryption Standards.
          </div>
        </div>
      </main>
    </div>
  );
}
