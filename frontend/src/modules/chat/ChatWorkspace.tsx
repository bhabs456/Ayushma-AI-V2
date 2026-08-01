"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  ChevronRight,
  BookOpen,
  Info,
  MessageSquare,
  Search,
  Pin,
  SquarePen,
  PanelRight,
  PanelLeft
} from "lucide-react";
import { Sidebar, SidebarBody, useSidebar } from "@/modules/layout/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet/sheet";

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

// Master passage dictionary for referencing in the sidebar resolver drawer
const masterPassages: Record<number, Passage> = {
  12: {
    id: 12,
    sourceDoc: "KDIGO Clinical Practice Guideline for BP in CKD",
    page: 48,
    content: "Recommendation 3.1.1: We suggest that an ACEi or ARB be initiated in adults with high BP, CKD, and albuminuria (Grade 1B). First-line therapy in elderly patients requires low initial titration.",
    confidence: 0.96
  },
  15: {
    id: 15,
    sourceDoc: "JNC-8 Pharmacotherapy Protocol Guidelines",
    page: 92,
    content: "Table 4: Dual therapy combination rules for Stage 2 HTN: Combine ACEi/ARB with DHP-CCB when SBP is >20 mmHg above target.",
    confidence: 0.92
  },
  18: {
    id: 18,
    sourceDoc: "Clinical Monitoring Protocols - Renal Safety v3.1",
    page: 14,
    content: "Mandatory lab check: Evaluate eGFR and K+ within 7–14 days following initiation or dose escalation of any RAAS inhibitor.",
    confidence: 0.89
  },
  21: {
    id: 21,
    sourceDoc: "WHO Clinical Management Guidelines 2025",
    page: 112,
    content: "Comprehensive assessment requires baseline eGFR, spot urinary albumin-to-creatinine ratio, and 24-hour ambulatory blood pressure monitoring.",
    confidence: 0.94
  },
  24: {
    id: 24,
    sourceDoc: "Primary Care Clinical Decision Matrix v2",
    page: 34,
    content: "High-risk patients require bi-weekly clinical monitoring until BP stabilization below 130/80 mmHg is established.",
    confidence: 0.91
  }
};

// Sidebar items layout mapped directly to the animation context of DesktopSidebar (open/collapsed)
interface WorkspaceSidebarProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveCitationId: React.Dispatch<React.SetStateAction<number | null>>;
  activeTab: "chat" | "search" | "pinned";
  setActiveTab: React.Dispatch<React.SetStateAction<"chat" | "search" | "pinned">>;
}

function WorkspaceSidebarContent({
  setMessages,
  setInputQuery,
  setActiveCitationId,
  activeTab,
  setActiveTab
}: WorkspaceSidebarProps) {
  const { open, setOpen } = useSidebar();

  const labelVariants = {
    open: { width: "auto", opacity: 1, marginLeft: 12, display: "inline-block" },
    closed: { width: 0, opacity: 0, marginLeft: 0, transitionEnd: { display: "none" } }
  };

  const profileVariants = {
    open: { width: "auto", opacity: 1, marginLeft: 12, display: "flex" },
    closed: { width: 0, opacity: 0, marginLeft: 0, transitionEnd: { display: "none" } }
  };

  const labelTransition = {
    width: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    marginLeft: { duration: 0.2 }
  } as const;

  return (
    <>
      {/* Top Section Icons */}
      <div className="flex flex-col gap-8 items-center w-full">
        
        {/* Sidebar Toggle Header Row */}
        <motion.div 
          animate={{
            paddingLeft: open ? "8px" : "0px",
            paddingRight: open ? "8px" : "0px",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center w-full min-h-8 justify-between"
        >
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            <motion.span 
              variants={labelVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              transition={labelTransition}
              className="font-display font-medium text-[15px] text-[var(--ink)] tracking-tight whitespace-nowrap"
            >
              Ayushman<span className="text-[var(--verify)] font-mono text-[10px] font-semibold ml-0.5">AI</span>
            </motion.span>
          </div>
          
          <button 
            onClick={() => setOpen(!open)}
            className={`p-1.5 text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface-raised)] rounded-lg transition-colors shrink-0 ${!open ? "mx-auto" : ""}`}
            title={open ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {open ? <PanelLeft className="w-4.5 h-4.5" /> : <PanelRight className="w-4.5 h-4.5" />}
          </button>
        </motion.div>

        {/* Action Divider Line */}
        <div className="w-8 h-[1px] bg-[var(--border-color)] shrink-0" />

        {/* New Chat Button */}
        <motion.button
          onClick={() => {
            setMessages([]);
            setInputQuery("");
            setActiveCitationId(null);
            setOpen(false);
          }}
          animate={{
            paddingLeft: open ? "14px" : "10px",
            justifyContent: open ? "flex-start" : "center",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full flex items-center rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--ink-dim)] hover:text-[var(--ink)] hover:border-[var(--verify)]/50 p-2.5 overflow-hidden whitespace-nowrap shrink-0"
          title="New Chat"
        >
          <SquarePen className="w-4.5 h-4.5 shrink-0" />
          <motion.span 
            variants={labelVariants}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={labelTransition}
            className="text-xs font-semibold whitespace-nowrap"
          >
            New Consultation
          </motion.span>
        </motion.button>

        {/* Sidebar Nav Tabs */}
        <div className="flex flex-col gap-4 w-full">
          <motion.button
            onClick={() => setActiveTab("search")}
            animate={{
              paddingLeft: open ? "12px" : "8px",
              justifyContent: open ? "flex-start" : "center",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full flex items-center rounded-xl p-2.5 overflow-hidden whitespace-nowrap ${
              activeTab === "search" 
                ? "text-[var(--verify)] bg-[var(--verify-dim)]/50 font-semibold" 
                : "text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface-raised)]"
            }`}
            title="Search Guidelines"
          >
            <Search className="w-4.5 h-4.5 shrink-0" />
            <motion.span 
              variants={labelVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              transition={labelTransition}
              className="text-xs whitespace-nowrap"
            >
              Search Guidelines
            </motion.span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("pinned")}
            animate={{
              paddingLeft: open ? "12px" : "8px",
              justifyContent: open ? "flex-start" : "center",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full flex items-center rounded-xl p-2.5 overflow-hidden whitespace-nowrap ${
              activeTab === "pinned" 
                ? "text-[var(--verify)] bg-[var(--verify-dim)]/50 font-semibold" 
                : "text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface-raised)]"
            }`}
            title="Pinned References"
          >
            <Pin className="w-4.5 h-4.5 shrink-0" />
            <motion.span 
              variants={labelVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              transition={labelTransition}
              className="text-xs whitespace-nowrap"
            >
              Pinned References
            </motion.span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("chat")}
            animate={{
              paddingLeft: open ? "12px" : "8px",
              justifyContent: open ? "flex-start" : "center",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full flex items-center rounded-xl p-2.5 overflow-hidden whitespace-nowrap ${
              activeTab === "chat" 
                ? "text-[var(--verify)] bg-[var(--verify-dim)]/50 font-semibold" 
                : "text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface-raised)]"
            }`}
            title="Chat History"
          >
            <MessageSquare className="w-4.5 h-4.5 shrink-0" />
            <motion.span 
              variants={labelVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              transition={labelTransition}
              className="text-xs whitespace-nowrap"
            >
              Chat History
            </motion.span>
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: (open && activeTab === "chat") ? 176 : 0,
            opacity: (open && activeTab === "chat") ? 1 : 0,
            marginTop: (open && activeTab === "chat") ? 8 : 0,
          }}
          transition={{
            height: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full flex flex-col gap-1.5 overflow-y-auto px-2 overflow-x-hidden whitespace-nowrap shrink-0"
        >
          <div className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider px-2 font-bold font-mono">
            Recent Sessions
          </div>
          <div 
            onClick={() => {
              setMessages([
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
                    masterPassages[12],
                    masterPassages[15],
                    masterPassages[18]
                  ],
                  timestamp: "10:42 AM",
                },
              ]);
              setOpen(false);
            }}
            className="p-2 rounded-lg bg-[var(--surface-raised)] border border-white/[0.03] text-xs text-[var(--ink)] cursor-pointer truncate font-body hover:brightness-110"
          >
            Stage 2 HTN in Elderly CKD
          </div>
        </motion.div>

      </div>

      {/* Bottom Section - User Profile (Green BH Avatar) */}
      <motion.div 
        animate={{
          paddingLeft: open ? "14px" : "0px",
          justifyContent: open ? "flex-start" : "center",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center w-full shrink-0 whitespace-nowrap overflow-hidden"
      >
        <div 
          className="w-8.5 h-8.5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[11px] font-bold shrink-0 font-mono shadow-md"
          title="Bhabani Shankar (Physician Evaluator)"
        >
          BH
        </div>
        <motion.div 
          variants={profileVariants}
          initial={false}
          animate={open ? "open" : "closed"}
          transition={labelTransition}
          className="flex flex-col text-left whitespace-nowrap overflow-hidden"
        >
          <span className="text-xs font-semibold text-[var(--ink)] leading-none">Bhabani Shankar</span>
          <span className="text-[8px] text-[var(--ink-faint)] font-mono mt-1 uppercase tracking-wider">CLINICAL EVALUATOR</span>
        </motion.div>
      </motion.div>
    </>
  );
}

function ChatWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeCitationId, setActiveCitationId] = useState<number | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Default collapsed
  const [activeTab, setActiveTab] = useState<"chat" | "search" | "pinned">("chat");
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const starterPrompts = [
    { label: "Diabetes Threshold", query: "What is the diagnostic threshold for diabetes mellitus?" },
    { label: "CKD Staging", query: "What are the stage classifications for chronic kidney disease?" },
    { label: "Pediatric Asthma", query: "What is the first-line pharmacotherapy for pediatric asthma exacerbation?" }
  ];

  const handleSend = (queryToSend?: string) => {
    const activeQuery = queryToSend || inputQuery;
    if (!activeQuery.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: activeQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const isLowConf = activeQuery.toLowerCase().includes("unverified") || activeQuery.toLowerCase().includes("unknown");

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
            content: `Regarding "${activeQuery}": Based on standard clinical protocols, primary evaluation prioritizes baseline assessment of renal function and blood pressure logs [21]. Follow-up should be scheduled within 2 to 4 weeks depending on initial risk stratification [24].`,
            citations: [21, 24],
            passages: [
              masterPassages[21],
              masterPassages[24]
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1200);
  };

  const activePassage = activeCitationId ? masterPassages[activeCitationId] : null;

  return (
    <div className="h-screen bg-[var(--void)] flex overflow-hidden selection:bg-[var(--violet-dim)] selection:text-[var(--violet)] relative">
      
      {/* Collapsible Sidebar Rail utilizing modular layout components */}
      <Sidebar open={sidebarExpanded} setOpen={setSidebarExpanded}>
        <SidebarBody className="justify-between gap-10">
          <WorkspaceSidebarContent
            setMessages={setMessages}
            setInputQuery={setInputQuery}
            setActiveCitationId={setActiveCitationId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </SidebarBody>
      </Sidebar>

      {/* Chat Workspace Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--void)] relative">
        
        {/* Floating Exit Row (No Nav Bar) */}
        <div className="absolute top-4 right-4 flex items-center justify-end z-20">
          <Link 
            href="/" 
            className="text-xs font-mono text-[var(--ink-dim)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border-color)] px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Chat</span>
          </Link>
        </div>

        {/* Message Thread Scroll Stream */}
        <div className="flex-grow overflow-y-auto px-04 sm:px-6 md:px-8 pt-24 pb-36 flex flex-col">
          {messages.length === 0 ? (
            
            /* Centered Claude-style Empty State */
            <div className="flex-grow flex flex-col items-center justify-center text-center max-w-[620px] mx-auto gap-8 my-auto">
              <div className="flex flex-col gap-2">
                <span className="font-display text-4xl font-normal text-[var(--ink)] tracking-tight">
                  Ayushman<span className="text-[var(--verify)] font-mono text-sm font-semibold ml-1">AI</span>
                </span>
                <p className="text-sm text-[var(--ink-dim)] leading-relaxed font-body mt-1">
                  Verifiable medical guidelines & reference tracing workspace.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="text-[9px] font-mono text-[var(--ink-faint)] uppercase tracking-wider text-left pl-1">
                  Starter guideline queries
                </div>
                <div className="flex flex-col gap-2">
                  {starterPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.query)}
                      className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--border-color)] text-xs text-[var(--ink-dim)] hover:text-[var(--ink)] text-left flex items-center justify-between group transition-all"
                    >
                      <span className="truncate pr-4">{p.query}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--ink-faint)] group-hover:text-[var(--verify)] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            
            /* Chat message container */
            <div className="max-w-[700px] w-full mx-auto flex flex-col gap-8">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                  
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

                      <div className="text-[var(--ink)] text-sm leading-relaxed font-body">
                        {renderFormattedAIResponse(
                          msg.content,
                          activeCitationId,
                          (id) => setActiveCitationId((prev) => (prev === id ? null : id)),
                          "chat-cite-"
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="max-w-[700px] w-full mx-auto text-mono text-[11px] text-[var(--ink-dim)] flex items-center gap-2 font-mono pl-1">
                  <span>Grounding response</span>
                  <span className="typing-pulse">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Centered Claude-style Floating Prompt Box (Single-layer design) */}
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

      </main>

      {/* Slide-out Document Drawer Panel utilizing Sheet UI Component */}
      <Sheet 
        open={activeCitationId !== null} 
        onOpenChange={(open) => {
          if (!open) setActiveCitationId(null);
        }}
      >
        <SheetContent hideClose className="sm:w-[480px] w-full border-l border-[var(--border-color)] flex flex-col p-0">
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
                <div className="flex-1 flex flex-col gap-3">
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
          className={`citation-index cursor-pointer inline-block px-1.5 py-0.5 rounded mx-0.5 text-xs font-mono select-none transition-all ${
            isActive 
              ? "bg-[var(--verify-dim)] text-[var(--verify)] border border-[var(--verify)]/30 font-bold shadow-[0_0_8px_rgba(61,217,180,0.15)]" 
              : "bg-[var(--surface-raised)] text-[var(--ink-dim)] border border-[var(--border-color)] hover:border-[var(--verify)]/40 hover:text-[var(--verify)]"
          }`}
        >
          [{citeId}]
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}
