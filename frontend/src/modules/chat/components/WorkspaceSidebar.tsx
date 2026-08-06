"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Pin, PanelRight, PanelLeft, SquarePen } from "lucide-react";
import { useSidebar } from "@/modules/layout/sidebar";

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

interface WorkspaceSidebarProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputQuery: React.Dispatch<React.SetStateAction<string>>;
  setActiveCitationId: React.Dispatch<React.SetStateAction<number | null>>;
  activeTab: "chat" | "search" | "pinned";
  setActiveTab: React.Dispatch<React.SetStateAction<"chat" | "search" | "pinned">>;
}

export function WorkspaceSidebar({
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
            height: (open && activeTab === "chat") ? 64 : 0,
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
          <div className="text-[10px] text-[var(--ink-faint)] italic px-2 font-body select-none">
            No recent sessions
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
