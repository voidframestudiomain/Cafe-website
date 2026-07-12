"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useScrollProgress";

/** Hairline reading-progress bar fixed to the top of the viewport. */
export default function ScrollProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const update = () => {
      frame.current = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-[--ink]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
