"use client";

import React, { useRef, useState, useEffect } from "react";

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number; // Distance between items in layout (margin)
  itemScale?: number; // How much each item scales down when stacked underneath
  itemStackDistance?: number; // Top offset padding between stacked cards (e.g. 20px)
  baseScale?: number; // Starting scale for the first item
  blurAmount?: number; // Blur intensity for stacked items (in pixels)
  rotationAmount?: number; // Max rotation angle applied to items
}

interface ScrollStackItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollStackItem({
  children,
  className = "",
  style = {},
}: ScrollStackItemProps) {
  return (
    <div
      className={`scroll-stack-item w-full transition-all duration-300 ${className}`}
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 40,
  itemScale = 0.04,
  itemStackDistance = 24,
  baseScale = 1.0,
  blurAmount = 4,
  rotationAmount = 0,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number[]>([]);

  const items = React.Children.toArray(children);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewHeight = window.innerHeight;

      // Calculate scrolling progress for each item
      const itemElements = container.querySelectorAll(".scroll-stack-item");
      const progressArray: number[] = [];

      itemElements.forEach((el, index) => {
        const itemRect = el.getBoundingClientRect();
        // How far the item has scrolled past the trigger position
        const itemTopRelative = itemRect.top - (index * itemStackDistance + 80);
        
        // Progress runs from 0 (not stacked) to 1 (fully stacked/pinned)
        const progress = Math.min(Math.max(-itemTopRelative / 150, 0), 1);
        progressArray.push(progress);
      });

      setScrollProgress(progressArray);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initially
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [itemStackDistance, items.length]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-full relative ${className}`}
      style={{
        gap: `${itemDistance}px`,
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        // Calculate dynamic scales and styles based on scroll depth of subsequent items
        let currentScale = baseScale;
        let currentBlur = 0;
        let currentRotation = 0;

        // Check progress of items stacked above this one
        for (let i = index + 1; i < items.length; i++) {
          const prog = scrollProgress[i] || 0;
          if (prog > 0) {
            currentScale -= itemScale * prog;
            currentBlur += blurAmount * prog;
            currentRotation += (index % 2 === 0 ? -1 : 1) * rotationAmount * prog;
          }
        }

        // Apply sticky styling properties
        const stickyStyle: React.CSSProperties = {
          position: "sticky",
          top: `${index * itemStackDistance + 80}px`,
          zIndex: index + 10,
          transform: `scale(${Math.max(currentScale, 0.7)}) rotate(${currentRotation}deg)`,
          filter: currentBlur > 0 ? `blur(${currentBlur}px)` : "none",
          transformOrigin: "center top",
        };

        return React.cloneElement(child as React.ReactElement<any>, {
          style: {
            ...(child as React.ReactElement<any>).props?.style,
            ...stickyStyle,
          },
        });
      })}
    </div>
  );
}