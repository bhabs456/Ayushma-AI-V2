"use client";

import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

interface Passage {
  id: number;
  sourceDoc: string;
  page: number;
  content: string;
  confidence: number;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  citations?: number[];
  passages?: Passage[];
  unverified?: boolean;
  timestamp: string;
}

interface MessageStreamProps {
  messages: Message[];
  isLoading: boolean;
  activeCitationId: number | null;
  onSelectCitation: (id: number) => void;
}

export function MessageStream({
  messages,
  isLoading,
  activeCitationId,
  onSelectCitation,
}: MessageStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message entry
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-grow overflow-y-auto px-4 sm:px-6 md:px-8 pt-24 pb-36 flex flex-col">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            activeCitationId={activeCitationId}
            onSelectCitation={onSelectCitation}
          />
        ))}

        {isLoading && (
          <div className="w-full text-mono text-[11px] text-[var(--ink-dim)] flex items-center gap-2 font-mono pl-1">
            <span>Grounding response</span>
            <span className="typing-pulse">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </div>
  );
}
