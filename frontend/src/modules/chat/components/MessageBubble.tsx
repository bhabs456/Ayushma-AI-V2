"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface MessageBubbleProps {
  msg: Message;
  activeCitationId: number | null;
  onSelectCitation: (id: number) => void;
}

// Pre-process raw text to convert [1], [2] bracket references into standard markdown links
function preprocessCitations(text: string): string {
  return text.replace(/\[(\d+)\]/g, "[[Ref $1]](#cite-$1)");
}

export function MessageBubble({
  msg,
  activeCitationId,
  onSelectCitation,
}: MessageBubbleProps) {
  return (
    <div className="w-full font-body">
      {/* User Bubble */}
      {msg.sender === "user" ? (
        <div className="flex justify-end w-full">
          <div className="bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--ink)] text-sm px-4 py-3 rounded-2xl max-w-[85%] font-body">
            {msg.content}
          </div>
        </div>
      ) : (
        /* AI message formatting with inline references */
        <div className="flex flex-col gap-4 w-full">
          {msg.unverified && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/20 border border-red-900/30 text-red-400 text-[10px] font-mono uppercase tracking-wider self-start">
              Unverified Output
            </div>
          )}

          <div className="text-[var(--ink)] text-sm leading-relaxed markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }: any) => {
                  if (href && href.startsWith("#cite-")) {
                    const citeId = parseInt(href.replace("#cite-", ""), 10);
                    const isActive = activeCitationId === citeId;
                    return (
                      <span
                        onClick={() => onSelectCitation(citeId)}
                        className={`citation-index cursor-pointer inline-block px-1.5 py-0.5 rounded mx-0.5 text-xs font-mono select-none transition-all ${
                          isActive
                            ? "bg-[var(--verify-dim)] text-[var(--verify)] border border-[var(--verify)]/30 font-bold shadow-[0_0_8px_rgba(61,217,180,0.15)]"
                            : "bg-[var(--surface-raised)] text-[var(--ink-dim)] border border-[var(--border-color)] hover:border-[var(--verify)]/40 hover:text-[var(--verify)]"
                        }`}
                      >
                        {children}
                      </span>
                    );
                  }
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--verify)] underline"
                    >
                      {children}
                    </a>
                  );
                },
                table: ({ children }: any) => (
                  <div className="overflow-x-auto my-4 border border-[var(--border-color)] rounded-xl bg-[var(--surface)]/30">
                    <table className="min-w-full divide-y divide-[var(--border-color)] text-xs text-left">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }: any) => (
                  <thead className="bg-[var(--surface-raised)]/80 text-[var(--ink-dim)] font-mono uppercase tracking-wider">
                    {children}
                  </thead>
                ),
                th: ({ children }: any) => (
                  <th className="px-4 py-3 font-semibold border-b border-[var(--border-color)]">
                    {children}
                  </th>
                ),
                td: ({ children }: any) => (
                  <td className="px-4 py-3 border-b border-[var(--border-color)]/40 text-[var(--ink)] leading-normal">
                    {children}
                  </td>
                ),
                p: ({ children }: any) => (
                  <p className="mb-4 last:mb-0 leading-relaxed text-[var(--ink-dim)]">
                    {children}
                  </p>
                ),
                h1: ({ children }: any) => (
                  <h1 className="text-[13px] font-bold text-[var(--verify)] uppercase tracking-wider font-body mt-7 mb-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }: any) => (
                  <h2 className="text-[13px] font-bold text-[var(--verify)] uppercase tracking-wider font-body mt-7 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }: any) => (
                  <h3 className="text-[13px] font-bold text-[var(--verify)] uppercase tracking-wider font-body mt-7 mb-4 first:mt-0">
                    {children}
                  </h3>
                ),
                ul: ({ children }: any) => (
                  <ul className="list-disc list-outside pl-5 space-y-3.5 my-5 text-[var(--ink-dim)] leading-relaxed">
                    {children}
                  </ul>
                ),
                ol: ({ children }: any) => (
                  <ol className="list-decimal list-outside pl-5 space-y-3.5 my-5 text-[var(--ink-dim)] leading-relaxed">
                    {children}
                  </ol>
                ),
                li: ({ children }: any) => (
                  <li className="text-[13px] text-[var(--ink-dim)] pl-1">
                    <span className="text-[var(--ink)]">{children}</span>
                  </li>
                ),
                blockquote: ({ children }: any) => (
                  <blockquote className="my-6 p-4.5 pl-6 rounded-xl border-l-2 border-red-500 bg-red-950/10 text-[var(--danger)] text-xs leading-relaxed italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {preprocessCitations(msg.content)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
