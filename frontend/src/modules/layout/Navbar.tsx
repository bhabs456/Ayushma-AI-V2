"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DirectionalText } from "@/components/DirectionalText";

interface NavbarProps {
  activePage?: "home" | "chat" | "login" | "signup";
}

export const Navbar: React.FC<NavbarProps> = ({ activePage = "home" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch logged in user details if token exists
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setHasToken(true);
      fetch('http://127.0.0.1:8000/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.data) {
          setUser(data.data);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setHasToken(false);
      });
    } else {
      setHasToken(false);
    }
  }, []);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[93%] max-w-6xl">
      <header
        className={`flex items-center justify-between px-6 md:px-8 py-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-white/[0.08] bg-[var(--void)]/80 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            : "border-white/[0.04] bg-[var(--void)]/50 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-body font-semibold text-[15px] tracking-tight shrink-0"
        >
          <DirectionalText activeColor="var(--verify)" restingColor="var(--ink)">
            Ayushman.AI
          </DirectionalText>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium">
          <a href="#how-it-works">
            <DirectionalText activeColor="var(--ink)" restingColor="var(--ink-dim)">
              How it works
            </DirectionalText>
          </a>
          <a href="#who-uses-it">
            <DirectionalText activeColor="var(--ink)" restingColor="var(--ink-dim)">
              Use cases
            </DirectionalText>
          </a>
          <Link href="/chat">
            <DirectionalText activeColor="var(--ink)" restingColor="var(--ink-dim)">
              Try it
            </DirectionalText>
          </Link>
          
          {!mounted || hasToken === null ? (
            <div className="w-20 h-[30px]" />
          ) : hasToken ? (
            <div
              className="flex items-center gap-2 bg-neutral-900/40 border border-white/5 text-neutral-300 font-semibold text-[12px] px-3.5 py-1.5 rounded-lg select-none"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--verify)]/80 flex items-center justify-center text-[var(--void)] text-[9px] font-bold font-mono shadow-sm">
                {user ? ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() : 'U'}
              </div>
              <span>Workspace</span>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center justify-center bg-[var(--verify)] text-[var(--void)] font-semibold text-[13px] px-5 py-2 rounded-lg hover:brightness-110 transition-all duration-200 shadow-sm"
            >
              Log in
            </Link>
          )}
        </nav>



        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-[var(--ink)] transition-all duration-200 ${
              mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[var(--ink)] transition-all duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[var(--ink)] transition-all duration-200 ${
              mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-white/[0.06] bg-[var(--void)]/95 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] p-6 flex flex-col gap-4 text-sm">
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors py-1"
          >
            How it works
          </a>
          <a
            href="#who-uses-it"
            onClick={() => setMobileOpen(false)}
            className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors py-1"
          >
            Use cases
          </a>
          <Link
            href="/chat"
            onClick={() => setMobileOpen(false)}
            className="text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors py-1"
          >
            Try it
          </Link>

          {!mounted || hasToken === null ? (
            <div className="w-full h-11" />
          ) : hasToken ? (
            <div
              className="flex items-center justify-between border border-white/5 bg-neutral-900/40 text-neutral-300 font-semibold text-sm px-5 py-2.5 rounded-lg select-none"
            >
              <span>Workspace</span>
              <div className="w-6 h-6 rounded-full bg-[var(--verify)]/80 flex items-center justify-center text-[var(--void)] text-[10px] font-bold font-mono">
                {user ? ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center bg-[var(--verify)] text-[var(--void)] font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all mt-2"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
