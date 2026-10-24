"use client";

import { useState, useRef, ReactNode } from "react";

type TooltipProps = {
  content: React.ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
};

export function Tooltip({ content, children, side = "top", className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const show = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: side === "top" ? rect.top : rect.bottom,
    });
    setVisible(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`pointer-events-none fixed z-9999 -translate-x-1/2 ${
            side === "top" ? "-translate-y-full -mt-2" : "mt-2"
          } px-3 py-1.5 rounded-lg border border-border bg-surface shadow-xl text-xs whitespace-nowrap text-foreground`}
          style={{ left: coords.x, top: coords.y }}
        >
          {content}
        </div>
      )}
    </div>
  );
}