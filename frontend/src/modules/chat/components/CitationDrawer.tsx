"use client";

import React from "react";
import { BookOpen, X, Info } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet/sheet";

interface Passage {
  id: number;
  sourceDoc: string;
  page: number;
  content: string;
  confidence: number;
}

interface CitationDrawerProps {
  activeCitationId: number | null;
  setActiveCitationId: (id: number | null) => void;
  activePassage: Passage | null;
}

export function CitationDrawer({
  activeCitationId,
  setActiveCitationId,
  activePassage,
}: CitationDrawerProps) {
  return (
    <Sheet 
      open={activeCitationId !== null} 
      onOpenChange={(open) => {
        if (!open) setActiveCitationId(null);
      }}
    >
      <SheetContent hideClose className="sm:w-[480px] w-full border-l border-[var(--border-color)] flex flex-col p-0 bg-[var(--surface)]">
        {activePassage ? (
          <div className="h-full flex flex-col">
            
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-black/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--verify)]" />
                <span className="font-display font-medium text-sm text-[var(--ink)]">
                  Reference Context
                </span>
              </div>
              <button 
                onClick={() => setActiveCitationId(null)}
                className="rounded-lg p-1.5 border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-all cursor-pointer flex items-center justify-center"
                title="Close context"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Scroll Content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              
              {/* Document info card */}
              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] flex flex-col gap-3 font-mono">
                <div className="text-[10px] text-[var(--verify)] font-bold uppercase tracking-wider">
                  SOURCE ARCHIVE
                </div>
                <h3 className="text-xs font-semibold text-[var(--ink)] leading-relaxed font-body">
                  {activePassage.sourceDoc}
                </h3>
                <div className="flex justify-between items-center text-[10px] text-[var(--ink-dim)] border-t border-[var(--border-color)]/50 pt-2.5 mt-1">
                  <span>PAGE {activePassage.page}</span>
                  <span className="text-[var(--verify)] font-bold">CONFIDENCE: {(activePassage.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Exact Quote highlight box */}
              <div className="flex-grow flex flex-col gap-3">
                <div className="text-[10px] font-mono text-[var(--ink-faint)] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[var(--verify)]" />
                  <span>LITERAL PASSAGE CONTENT</span>
                </div>
                <div className="flex-grow p-4.5 rounded-xl bg-[var(--void)] border border-[var(--border-color)] text-[12px] text-[var(--ink-dim)] leading-relaxed font-mono select-all select-text italic">
                  "{activePassage.content}"
                </div>
              </div>

            </div>

            {/* Drawer Footer Status line */}
            <div className="px-5 py-3 border-t border-[var(--border-color)] text-[9px] text-[var(--ink-faint)] font-mono uppercase tracking-wider bg-black/10 shrink-0">
              Deterministic Ingestion Bound Active
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[var(--ink-faint)]">
            No active citation selected.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
