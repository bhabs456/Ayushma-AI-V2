"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

interface NavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  theme?: "light" | "dark";
  initialLoadAnimation?: boolean;
}

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref = "/",
  className = "",
  ease = "power2.out",
  baseColor = "#000000",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#000000",
  pillTextColor = "#000000",
  theme = "dark",
  initialLoadAnimation = false,
}: PillNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Find index of currently active href
  const activeIdx = items.findIndex((item) => item.href === activeHref);
  const currentTargetIdx = hoveredIdx !== null ? hoveredIdx : (activeIdx !== -1 ? activeIdx : null);

  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    if (currentTargetIdx === null) {
      // Hide pill if nothing is active or hovered
      gsap.to(pill, {
        opacity: 0,
        scale: 0.8,
        duration: 0.25,
        ease: ease,
      });
      return;
    }

    const targetEl = itemRefs.current[currentTargetIdx];
    if (!targetEl) return;

    // Calculate relative offsets
    const rect = targetEl.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      const left = rect.left - containerRect.left;
      const top = rect.top - containerRect.top;
      const width = rect.width;
      const height = rect.height;

      gsap.to(pill, {
        opacity: 1,
        scale: 1,
        left: left,
        top: top,
        width: width,
        height: height,
        duration: 0.3,
        ease: ease,
      });
    }
  }, [currentTargetIdx, ease]);

  // Initial animation
  useEffect(() => {
    if (initialLoadAnimation && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [initialLoadAnimation]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-between px-6 py-3 rounded-full border border-white/10 shadow-lg select-none transition-all duration-300 ${className}`}
      style={{
        backgroundColor: baseColor,
      }}
    >
      {/* Sliding background pill */}
      <div
        ref={pillRef}
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          backgroundColor: pillColor,
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          opacity: 0,
        }}
      />

      {/* Left side: Logo */}
      {logo && (
        <Link href="/" className="z-10 flex items-center gap-2 mr-6 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} className="h-6 w-auto" />
        </Link>
      )}

      {/* Navigation links container */}
      <div className="flex items-center gap-1 z-10 w-full justify-end md:justify-center">
        {items.map((item, idx) => {
          const isActive = idx === activeIdx;
          const isHovered = idx === hoveredIdx;
          const isPilled = idx === currentTargetIdx;

          // Compute text color
          let textColor = theme === "light" ? "#1e293b" : "#e2e8f0"; // fallback
          if (isPilled) {
            textColor = isHovered ? hoveredPillTextColor : pillTextColor;
          }

          return (
            <Link
              key={idx}
              href={item.href}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider font-mono rounded-full transition-colors duration-250"
              style={{
                color: textColor,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
