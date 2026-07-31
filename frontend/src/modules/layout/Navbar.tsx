"use client";

import React from "react";
import Link from "next/link";

interface NavbarProps {
  activePage?: "home" | "chat" | "login" | "signup";
}

export const Navbar: React.FC<NavbarProps> = ({ activePage = "home" }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl">
      <header className="flex items-center justify-between px-8 py-3.5 rounded-4xl border border-white/[0.06] bg-black/45 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
        
        {/* Left Side: Plain Text Logo */}
        <Link 
          href="/" 
          className="font-display font-semibold text-[15px] tracking-tight text-[var(--ink)] hover:opacity-90 transition-opacity shrink-0"
        >
          Ayushman.AI
        </Link>

        {/* Right Corner: Navigation and Auth Links */}
        <div className="flex items-center gap-6 md:gap-8 text-xs font-semibold uppercase tracking-wider font-mono">
          <a
            href="#how-it-helps"
            className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
          >
            How it helps
          </a>
          
          <Link
            href="/chat"
            className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
          >
            Try it free
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center bg-white text-black font-display font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all duration-200 shadow-sm cursor-pointer"
          >
            Log in &rarr;
          </Link>
        </div>

      </header>
    </div>
  );
};
