"use client";

import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  inputQuery: string;
  setInputQuery: (val: string) => void;
  isLoading: boolean;
  handleSend: () => void | Promise<void>;
}

export function MessageInput({
  inputQuery,
  setInputQuery,
  isLoading,
  handleSend,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as text content expands
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputQuery]);

  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/95 to-transparent pt-10 pb-8 px-4 z-10">
      <div className="max-w-[700px] mx-auto relative flex items-center bg-[var(--surface-raised)] border border-[var(--border-color)] focus-within:border-[var(--verify)]/60 focus-within:ring-1 focus-within:ring-[var(--verify)]/10 rounded-2xl pl-5 pr-16 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] focus-within:shadow-[0_12px_45px_rgba(61,217,180,0.06)] transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a clinical evaluation query..."
          className="flex-grow bg-transparent text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none resize-none max-h-32 font-body py-0.5 leading-relaxed"
          style={{ height: "auto" }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="absolute right-4 w-10 h-10 rounded-full bg-[#10B981] disabled:bg-[var(--surface)] text-white disabled:text-[var(--ink-faint)] flex items-center justify-center hover:brightness-110 disabled:hover:brightness-100 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
