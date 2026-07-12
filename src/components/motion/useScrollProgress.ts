"use client";

import { useEffect, useRef } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Calls `onProgress(p)` with 0→1 while `ref` traverses the viewport
 * (0 = element top at viewport bottom, 1 = element bottom at viewport top).
 * rAF-throttled, passive, transform-friendly.
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void
) {
  const frame = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / total));
      onProgress(p);
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Progress through a PINNED (sticky) section: 0 when the outer wrapper's top
 * hits the viewport top, 1 when its bottom reaches the viewport bottom.
 */
export function usePinProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void
) {
  const frame = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return onProgress(0);
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      onProgress(p);
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
