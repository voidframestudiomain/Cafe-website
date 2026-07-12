"use client";

import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";

/**
 * Parallax wrapper — the child drifts vertically as the wrapper crosses the
 * viewport. Child is oversized slightly so edges never show.
 */
export default function Parallax({
  children,
  strength = 70,
  className = "",
}: {
  children: React.ReactNode;
  /** Max drift in px (positive = image moves up while scrolling down). */
  strength?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useScrollProgress(outer, (p) => {
    if (inner.current) {
      const y = (p - 0.5) * -2 * strength;
      inner.current.style.transform = `translate3d(0, ${y}px, 0) scale(1.12)`;
    }
  });

  return (
    <div ref={outer} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full will-change-transform" style={{ transform: "scale(1.12)" }}>
        {children}
      </div>
    </div>
  );
}
