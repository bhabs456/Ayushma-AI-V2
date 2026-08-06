"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sidebar, SidebarBody } from "@/modules/layout/sidebar";

import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { EmptyState } from "./components/EmptyState";
import { MessageStream } from "./components/MessageStream";
import { MessageInput } from "./components/MessageInput";
import { CitationDrawer } from "./components/CitationDrawer";
import { RippleEffect } from "@/components/Ripple_Effect";

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
  const [activeCitationId, setActiveCitationId] = useState<number | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Default collapsed
  const [activeTab, setActiveTab] = useState<"chat" | "search" | "pinned">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load consultation history from sessionStorage on mount (client-side)
  React.useEffect(() => {
    const saved = sessionStorage.getItem("ayushman_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load saved consultation session:", e);
      }
    }
    // Complete initialization after loading history
    setIsInitializing(false);
  }, []);

  // Sync consultation messages with sessionStorage on updates
  React.useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("ayushman_chat_history", JSON.stringify(messages));
    } else {
      sessionStorage.removeItem("ayushman_chat_history");
    }
  }, [messages]);

  const starterPrompts = [
    { label: "Diabetes Threshold", query: "What is the diagnostic threshold for diabetes mellitus?" },
    { label: "CKD Staging", query: "What are the stage classifications for chronic kidney disease?" },
    { label: "Pediatric Asthma", query: "What is the first-line pharmacotherapy for pediatric asthma exacerbation?" }
  ];

  const handleSend = async (queryToSend?: string) => {
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

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        content: m.content,
      }));

      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: activeQuery,
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const unverified = !data.citations || data.citations.length === 0;

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        content: data.response,
        citations: data.citations ? data.citations.map((_: any, idx: number) => idx + 1) : [],
        passages: data.citations ? data.citations.map((c: any, idx: number) => ({
          id: idx + 1,
          sourceDoc: c.sourceDoc || "Unknown Document",
          page: c.page,
          content: c.snippet,
          confidence: 0.95
        })) : [],
        unverified,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn("Clinical server connection issue:", err.message || err);
      
      const offlineMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        content: "### ⚠️ Connection Offline\n\nI am currently operating in **offline fallback mode** because I could not establish a connection with the clinical reference server.\n\n*   **Server Status**: Offline (Failed to fetch from `http://127.0.0.1:8000`)\n*   **Instructions**: Please run the backend API server by activating your virtual environment and running `python app.py` inside the `backend` directory.\n\nLive page-level source grounding will remain disabled until the connection is restored.",
        unverified: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMessages((prev) => [...prev, offlineMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const activePassage = activeCitationId !== null
    ? messages.flatMap((m) => m.passages || []).find((p) => p.id === activeCitationId) || null
    : null;

  if (isInitializing) {
    return <RippleEffect />;
  }

  return (
    <div className="h-screen bg-[var(--void)] flex overflow-hidden selection:bg-[var(--violet-dim)] selection:text-[var(--violet)] relative">
      
      {/* Collapsible Sidebar Rail utilizing modular layout components */}
      <Sidebar open={sidebarExpanded} setOpen={setSidebarExpanded}>
        <SidebarBody className="justify-between gap-10">
          <WorkspaceSidebar
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
            onClick={() => sessionStorage.removeItem("ayushman_chat_history")}
            className="text-xs font-mono text-[var(--ink-dim)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border-color)] px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Chat</span>
          </Link>
        </div>

        {/* Message Thread Scroll Stream or Empty State */}
        {messages.length === 0 ? (
          <EmptyState
            starterPrompts={starterPrompts}
            handleSend={handleSend}
          />
        ) : (
          <MessageStream
            messages={messages}
            isLoading={isLoading}
            activeCitationId={activeCitationId}
            onSelectCitation={(id) => setActiveCitationId((prev) => (prev === id ? null : id))}
          />
        )}

        {/* Centered Claude-style Floating Prompt Box */}
        <MessageInput
          inputQuery={inputQuery}
          setInputQuery={setInputQuery}
          isLoading={isLoading}
          handleSend={handleSend}
        />

      </main>

      {/* Slide-out Document Drawer Panel */}
      <CitationDrawer
        activeCitationId={activeCitationId}
        setActiveCitationId={setActiveCitationId}
        activePassage={activePassage}
      />

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
