"use client";

import React, { useState, createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SheetSide = "top" | "bottom" | "left" | "right";

interface SheetContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: SheetSide;
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet sub-components must be rendered within a <Sheet /> provider");
  }
  return context;
}

const sideStyles: Record<SheetSide, { structural: string; openState: string; closedState: string }> = {
  right: {
    structural: "top-0 right-0 h-full w-full sm:w-96 border-l",
    openState: "translate-x-0",
    closedState: "translate-x-full",
  },
  left: {
    structural: "top-0 left-0 h-full w-full sm:w-96 border-r",
    openState: "translate-x-0",
    closedState: "-translate-x-full",
  },
  top: {
    structural: "top-0 left-0 w-full h-auto max-h-[80vh] border-b",
    openState: "translate-y-0",
    closedState: "-translate-y-full",
  },
  bottom: {
    structural: "bottom-0 left-0 w-full h-auto max-h-[80vh] border-t",
    openState: "translate-y-0",
    closedState: "translate-y-full",
  },
};

/* ==========================================================================
   Root Sheet Provider Component
   ========================================================================== */
type SheetProps = {
  children: React.ReactNode;
  side?: SheetSide;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Sheet = ({ children, side = "right", open: controlledOpen, onOpenChange }: SheetProps) => {
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setLocalOpen;

  return (
    <SheetContext.Provider value={{ open, setOpen, side }}>
      <div>{children}</div>
    </SheetContext.Provider>
  );
};

/* ==========================================================================
   SheetTrigger Component
   ========================================================================== */
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SheetTrigger = ({ children, className, ...props }: SheetTriggerProps) => {
  const { setOpen } = useSheetContext();

  return (
    <button
      onClick={() => setOpen(true)}
      className={cn("bg-primary text-fg-inverse px-4 py-2 rounded-md", className)}
      {...props}
    >
      {children}
    </button>
  );
};

/* ==========================================================================
   SheetContent Component
   ========================================================================== */
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hideClose?: boolean;
}

export const SheetContent = ({ children, className, hideClose = false, ...props }: SheetContentProps) => {
  const { open, setOpen, side } = useSheetContext();
  const currentSide = sideStyles[side];

  return (
    <>
      
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <div
        className={cn(
          "fixed z-50 bg-[var(--surface)] border-[var(--border-color)] shadow-2xl p-6 transition-transform duration-300 ease-out flex flex-col text-[var(--ink)]",
          currentSide.structural,
          open ? currentSide.openState : currentSide.closedState,
          className
        )}
        {...props}
      >
        {!hideClose && (
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-4.5 rounded-lg p-1.5 border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 mt-4 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

/* ==========================================================================
   SheetHeader Component
   ========================================================================== */
interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SheetHeader = ({ children, className, ...props }: SheetHeaderProps) => {
  return (
    <div className={cn("flex flex-col gap-1 text-left mb-4", className)} {...props}>
      {children}
    </div>
  );
};

/* ==========================================================================
   SheetTitle Component
   ========================================================================== */
interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const SheetTitle = ({ children, className, ...props }: SheetTitleProps) => {
  return (
    <h3 className={cn("text-lg font-semibold text-fg leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
};

/* ==========================================================================
   SheetDescription Component
   ========================================================================== */
interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const SheetDescription = ({ children, className, ...props }: SheetDescriptionProps) => {
  return (
    <p className={cn("text-sm text-fg-muted", className)} {...props}>
      {children}
    </p>
  );
};

/* ==========================================================================
   SheetFooter Component
   ========================================================================== */
interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SheetFooter = ({ children, className, ...props }: SheetFooterProps) => {
  return (
    <div className={cn("mt-auto pt-4 flex flex-col sm:flex-row sm:justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
};