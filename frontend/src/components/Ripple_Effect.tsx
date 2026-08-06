"use client";

import React from "react";

export function RippleEffect() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--void)] w-full relative overflow-hidden z-50">
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Concentric ripples */}
        <div className="absolute rounded-full border border-[var(--verify)]/20 animate-ripple-1 w-full h-full" />
        <div className="absolute rounded-full border border-[var(--verify)]/15 animate-ripple-2 w-[75%] h-[75%]" />
        <div className="absolute rounded-full border border-[var(--verify)]/10 animate-ripple-3 w-[50%] h-[50%]" />
        
        {/* Core glowing dot */}
        <div className="relative w-8 h-8 rounded-full bg-[var(--verify)] shadow-[0_0_25px_var(--verify)] flex items-center justify-center z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>
      
      <p className="mt-8 text-xs font-mono text-[var(--ink-dim)] tracking-widest uppercase animate-pulse select-none">
        Initializing Clinical Workspace
      </p>

      <style>{`
        @keyframes rippleAnimation {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
            box-shadow: 0 0 0 0 rgba(61, 217, 180, 0.15);
          }
          50% {
            opacity: 0.55;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
            box-shadow: 0 0 0 50px rgba(61, 217, 180, 0);
          }
        }

        .animate-ripple-1 {
          animation: rippleAnimation 3s infinite linear;
        }

        .animate-ripple-2 {
          animation: rippleAnimation 3s infinite linear;
          animation-delay: 1s;
        }

        .animate-ripple-3 {
          animation: rippleAnimation 3s infinite linear;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
