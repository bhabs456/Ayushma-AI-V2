"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface CitationTraceOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeCitationId: number | null;
  citationSelectorPrefix?: string;
  sourceSelectorPrefix?: string;
}

export const CitationTraceOverlay: React.FC<CitationTraceOverlayProps> = ({
  containerRef,
  activeCitationId,
  citationSelectorPrefix = "citation-idx-",
  sourceSelectorPrefix = "citation-source-",
}) => {
  const [pathData, setPathData] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ start: Point; end: Point } | null>(null);

  const updateLine = useCallback(() => {
    if (!activeCitationId || !containerRef.current) {
      setPathData(null);
      setCoords(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const sourceEl = containerRef.current.querySelector(
      `#${citationSelectorPrefix}${activeCitationId}`
    );
    const targetEl = containerRef.current.querySelector(
      `#${sourceSelectorPrefix}${activeCitationId}`
    );

    if (!sourceEl || !targetEl) {
      setPathData(null);
      setCoords(null);
      return;
    }

    const sRect = sourceEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();

    // Start point: right center of citation tag
    const startX = sRect.right - containerRect.left;
    const startY = sRect.top + sRect.height / 2 - containerRect.top;

    // End point: left center of passage box in right rail
    const endX = tRect.left - containerRect.left;
    const endY = tRect.top + 24 - containerRect.top; // aligns nicely with header/card top

    // Bezier control points for a smooth organic spatial trace
    const deltaX = Math.abs(endX - startX) * 0.5;
    const cp1X = startX + deltaX;
    const cp1Y = startY;
    const cp2X = endX - deltaX;
    const cp2Y = endY;

    const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    setPathData(path);
    setCoords({ start: { x: startX, y: startY }, end: { x: endX, y: endY } });
  }, [activeCitationId, containerRef, citationSelectorPrefix, sourceSelectorPrefix]);

  useEffect(() => {
    updateLine();
    window.addEventListener("resize", updateLine);
    window.addEventListener("scroll", updateLine, true);

    return () => {
      window.removeEventListener("resize", updateLine);
      window.removeEventListener("scroll", updateLine, true);
    };
  }, [updateLine]);

  if (!activeCitationId || !pathData || !coords) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible hidden md:block"
      aria-hidden="true"
    >
      {/* Glow path behind line */}
      <path
        d={pathData}
        fill="none"
        stroke="var(--verify)"
        strokeWidth="3"
        strokeOpacity="0.2"
      />
      {/* Primary 1px trace line */}
      <path
        d={pathData}
        className="trace-path citation-trace-line"
        stroke="var(--verify)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Terminal anchor dots */}
      <circle cx={coords.start.x} cy={coords.start.y} r="3" fill="var(--verify)" />
      <circle cx={coords.end.x} cy={coords.end.y} r="3" fill="var(--verify)" />
    </svg>
  );
};
