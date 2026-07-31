"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CitationTraceOverlay } from "@/components/CitationTraceOverlay";

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

function ChatWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeCitationId, setActiveCitationId] = useState<number | null>(12);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "user",
      content: "What is the recommended pharmacological treatment for stage 2 hypertension in elderly patients with CKD?",
      timestamp: "10:42 AM",
    },
    {
      id: "msg-2",
      sender: "ai",
      content:
        "For elderly patients with stage 2 hypertension and co-existing Chronic Kidney Disease (CKD), initial monotherapy should begin with an Angiotensin Converting Enzyme (ACE) inhibitor or Angiotensin Receptor Blocker (ARB) [12]. If target blood pressure (<130/80 mmHg) is not achieved within 4 weeks, combine with a long-acting dihydropyridine calcium channel blocker (such as Amlodipine) [15]. Serum creatinine and potassium levels must be re-evaluated within 14 days of therapy initiation [18].",
      citations: [12, 15, 18],
      passages: [
        {
          id: 12,
          sourceDoc: "KDIGO Clinical Practice Guideline for Management of BP in CKD",
          page: 48,
          content:
            "Recommendation 3.1.1: We suggest that an ACEi or ARB be initiated in adults with high BP, CKD, and albuminuria (Grade 1B). First-line therapy in elderly patients requires low initial titration.",
          confidence: 0.96,
        },
        {
          id: 15,
          sourceDoc: "JNC-8 Pharmacotherapy Protocol Guidelines",
          page: 92,
          content:
            "Table 4: Dual therapy combination rules for Stage 2 HTN: Combine ACEi/ARB with DHP-CCB when SBP is >20 mmHg above target.",
          confidence: 0.92,
        },
        {
          id: 18,
          sourceDoc: "Clinical Monitoring Protocols - Renal Safety v3.1",
          page: 14,
          content:
            "Mandatory lab check: Evaluate eGFR and K+ within 7–14 days following initiation or dose escalation of any RAAS inhibitor.",
          confidence: 0.89,
        },
      ],
      timestamp: "10:42 AM",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const activePassageList = messages.flatMap((m) => m.passages || []);

  const handleSend = () => {
    if (!inputQuery.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQ = inputQuery;
    setInputQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const isLowConf = currentQ.toLowerCase().includes("unverified") || currentQ.toLowerCase().includes("unknown");

      const aiMsg: Message = isLowConf
        ? {
            id: `msg-${Date.now() + 1}`,
            sender: "ai",
            content:
              "I could not find matching clinical information with sufficient confidence in the indexed medical database for this specific inquiry.",
            unverified: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        : {
            id: `msg-${Date.now() + 1}`,
            sender: "ai",
            content: `Regarding "${currentQ}": Based on standard clinical protocols, primary evaluation prioritizes baseline assessment of renal function and blood pressure logs [21]. Follow-up should be scheduled within 2 to 4 weeks depending on initial risk stratification [24].`,
            citations: [21, 24],
            passages: [
              {
                id: 21,
                sourceDoc: "WHO Clinical Management Guidelines 2025",
                page: 112,
                content:
                  "Comprehensive assessment requires baseline eGFR, spot urinary albumin-to-creatinine ratio, and 24-hour ambulatory blood pressure monitoring.",
                confidence: 0.94,
              },
              {
                id: 24,
                sourceDoc: "Primary Care Clinical Decision Matrix v2",
                page: 34,
                content:
                  "High-risk patients require bi-weekly clinical monitoring until BP stabilization below 130/80 mmHg is established.",
                confidence: 0.91,
              },
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
      if (aiMsg.citations && aiMsg.citations.length > 0) {
        setActiveCitationId(aiMsg.citations[0]);
      }
    }, 1200);
  };

  return (
    <div className="h-screen bg-[var(--void)] flex flex-col overflow-hidden selection:bg-[var(--violet-dim)]">
      {/* Workspace Header */}
      <header className="h-[56px] hairline-b bg-black/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group">
            <span className="font-display font-semibold text-base tracking-tight text-[var(--ink)]">
              Ayushman<span className="text-[var(--ink-dim)] font-normal text-xs ml-1 font-mono">AI</span>
            </span>
          </Link>

          {/* Model Tag System Status Line */}
          <div className="hidden md:flex items-center gap-2.5 text-mono text-xs text-[var(--ink-dim)] font-mono">
            <span className="text-[var(--ink-faint)]">ENGINE:</span>
            <span className="text-[var(--ink)] font-medium">Regional Guidelines Verification</span>
            <span className="mx-1 text-[var(--border-color)]">|</span>
            <span className="text-[var(--verify)] font-semibold">ACTIVE CONTEXT LOADED</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-mono font-mono">
          <span className="text-[var(--ink-dim)] hidden sm:inline">Dr. S. Sharma</span>
          <Link href="/" className="btn-ghost py-1 px-3 text-xs rounded-[5px]">
            Exit Workspace
          </Link>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden relative" ref={workspaceRef}>
        {/* SVG Connector Overlay */}
        <CitationTraceOverlay
          containerRef={workspaceRef}
          activeCitationId={activeCitationId}
          citationSelectorPrefix="chat-cite-"
          sourceSelectorPrefix="chat-source-"
        />

        {/* Column 1: Sidebar (260px) */}
        <aside className="w-[260px] min-w-[260px] bg-[var(--surface)] hairline-r flex flex-col p-4 gap-4 hidden lg:flex shrink-0">
          <button
            onClick={() => setMessages([])}
            className="btn-primary w-full text-xs py-2.5 rounded-[6px] flex items-center justify-center gap-2 font-display font-semibold"
          >
            <span>+</span> New Clinical Consultation
          </button>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            <div className="text-mono text-[11px] text-[var(--ink-faint)] uppercase tracking-wider px-2 font-semibold font-mono">
              Recent Consultations
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="p-2.5 rounded-[6px] bg-[var(--surface-raised)] border border-white/5 text-xs text-[var(--ink)] cursor-pointer truncate font-body">
                Stage 2 HTN in Elderly CKD
              </div>
              <div className="p-2.5 rounded-[6px] hover:bg-[var(--surface-raised)] text-xs text-[var(--ink-dim)] cursor-pointer truncate font-body transition-colors">
                Metformin & SGLT2 Combination
              </div>
              <div className="p-2.5 rounded-[6px] hover:bg-[var(--surface-raised)] text-xs text-[var(--ink-dim)] cursor-pointer truncate font-body transition-colors">
                Acute Coronary Protocol Triage
              </div>
              <div className="p-2.5 rounded-[6px] hover:bg-[var(--surface-raised)] text-xs text-[var(--ink-dim)] cursor-pointer truncate font-body transition-colors">
                Pediatric Amoxicillin Dosage
              </div>
            </div>
          </div>
        </aside>

        {/* Column 2: Chat Workspace Stream */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--void)]">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm text-[var(--ink-dim)] font-body">
                  Ask about symptoms, medications, or a clinical protocol
                </p>
                <span className="text-mono text-xs text-[var(--ink-faint)] font-mono">
                  All generated clinical statements will be spatially mapped to source passages.
                </span>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-3 max-w-[72ch] w-full mx-auto">
                  {msg.sender === "user" ? (
                    <div className="message-user text-sm text-[var(--ink)] leading-relaxed rounded-[8px]">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="message-ai text-sm text-[var(--ink)] leading-relaxed flex flex-col gap-4">
                      {msg.unverified && (
                        <div className="inline-flex items-center gap-2 self-start">
                          <span className="status-unverified font-mono">.status-unverified</span>
                        </div>
                      )}

                      <div className="font-body text-[var(--ink)]">
                        {/* Process content to render interactive [N] citation triggers */}
                        {renderFormattedAIResponse(
                          msg.content,
                          activeCitationId,
                          (id) => setActiveCitationId(id),
                          "chat-cite-"
                        )}
                      </div>

                      <div className="flex items-center justify-between text-mono text-[11px] text-[var(--ink-faint)] pt-2.5 border-t border-[var(--border-color)] font-mono">
                        <span>Grounding: {msg.unverified ? "Unverified / Low Confidence" : "100% Passages Verifiable"}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="max-w-[72ch] w-full mx-auto text-mono text-xs text-[var(--ink-dim)] flex items-center gap-2 font-mono">
                <span>Analyzing clinical database</span>
                <span className="typing-pulse">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-5 bg-[var(--surface)] border-t border-[var(--border-color)] shrink-0">
            <div className="max-w-[72ch] mx-auto flex gap-3.5">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about symptoms, medications, or a clinical protocol..."
                className="flex-1 text-sm bg-[var(--void)] text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none border border-[var(--border-color)] rounded-[6px] px-4 py-3"
              />
              <button
                onClick={handleSend}
                disabled={!inputQuery.trim() || isLoading}
                className="btn-primary text-xs px-6 py-3 font-display font-semibold rounded-[6px] flex items-center justify-center min-w-[80px]"
              >
                {isLoading ? <span className="text-mono font-mono">···</span> : "Send"}
              </button>
            </div>
          </div>
        </main>

        {/* Column 3: Persistent Right Citation Rail (340px) */}
        <aside className="w-[340px] min-w-[340px] bg-[var(--surface)] hairline-l border-l border-[var(--border-hairline)] flex flex-col p-4 gap-4 overflow-y-auto shrink-0 hidden md:flex">
          <div className="flex items-center justify-between hairline-b pb-3.5 text-mono text-xs font-mono">
            <span className="text-[var(--ink-faint)] uppercase font-semibold">CITATION PASSAGE</span>
            <span className="text-[var(--verify)] font-semibold">
              {activeCitationId ? `PASSAGE [${activeCitationId}]` : "IDLE"}
            </span>
          </div>

          {activePassageList.length === 0 ? (
            <div className="py-12 text-center text-xs text-mono text-[var(--ink-faint)] font-mono">
              Click a citation to see its source
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activePassageList.map((passage) => {
                const isActive = passage.id === activeCitationId;
                return (
                  <div
                    key={passage.id}
                    id={`chat-source-${passage.id}`}
                    onClick={() => setActiveCitationId(passage.id)}
                    className={`surface p-4 flex flex-col gap-2.5 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--surface-raised)] border-[var(--verify)] shadow-md shadow-emerald-500/5"
                        : "bg-[var(--void)] opacity-50 hover:opacity-100 border-[var(--border-color)]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-mono text-[11px] font-mono">
                      <span className="text-[var(--verify)] font-semibold">
                        [{passage.id}] {passage.sourceDoc}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-mono text-[10px] text-[var(--ink-faint)] font-mono">
                      <span>Page {passage.page}</span>
                      <span>Confidence: {(passage.confidence * 100).toFixed(0)}%</span>
                    </div>

                    <p className="text-xs text-[var(--ink-dim)] leading-relaxed font-mono pt-1">
                      "{passage.content}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export function ChatWorkspace() {
  return (
    <Suspense fallback={<div className="h-screen bg-[var(--void)] flex items-center justify-center text-mono text-xs text-[var(--ink-dim)] font-mono">Loading workspace...</div>}>
      <ChatWorkspaceContent />
    </Suspense>
  );
}

// Helper to format inline string text with [N] citation triggers
function renderFormattedAIResponse(
  text: string,
  activeId: number | null,
  onSelect: (id: number) => void,
  prefix: string
) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, idx) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const citeId = parseInt(match[1], 10);
      const isActive = activeId === citeId;
      return (
        <span
          key={idx}
          id={`${prefix}${citeId}`}
          onClick={() => onSelect(citeId)}
          className={`citation-index ${isActive ? "bg-[var(--verify-dim)] font-semibold shadow-[0_0_6px_rgba(61,217,180,0.2)]" : ""}`}
        >
          [{citeId}]
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}
