"use client";

import { createContext, ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  openItems: string[];
  toggleItem: (value: string) => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
  null
);

type AccordionProps = {
  children: ReactNode;
  type?: AccordionType;
  defaultValue?: string | string[];
  className?: string;
};

export default function Accordion({
  children,
  type = "single",
  defaultValue,
  className,
}: AccordionProps) {
  const initialOpenItems = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : [];

  const [openItems, setOpenItems] = useState<string[]>(initialOpenItems);

  function toggleItem(value: string) {
    setOpenItems((currentItems) => {
      const isOpen = currentItems.includes(value);

      if (type === "multiple") {
        return isOpen
          ? currentItems.filter((item) => item !== value)
          : [...currentItems, value];
      }

      return isOpen ? [] : [value];
    });
  }

  return (
    <AccordionContext.Provider value={{ type, openItems, toggleItem }}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-lg border border-border bg-surface",
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}