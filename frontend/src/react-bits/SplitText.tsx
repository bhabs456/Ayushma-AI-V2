"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // delay in ms before animation starts
  duration?: number;
  ease?: string;
  textAlign?: "left" | "center" | "right";
}

export const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 0,
  duration = 0.8,
  ease = "power3.out",
  textAlign = "left",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Grab all character nodes
    const chars = el.querySelectorAll(".char-item");
    
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        stagger: 0.02,
        ease: ease,
        delay: delay / 1000,
      }
    );
  }, [text, delay, duration, ease]);

  // Split text into words, then each word into characters to prevent line break glitches
  const words = text.split(" ");

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ textAlign, display: "inline-block" }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="char-item inline-block opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
