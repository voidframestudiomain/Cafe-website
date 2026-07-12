"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Splits text into words and reveals them with a soft stagger when the
 * block enters the viewport — the sentence "assembles" as you read.
 */
export default function WordReveal({
  text,
  className = "",
  as: Tag = "p",
  stagger = 26,
}: {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3";
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <span
            className={`word inline-block ${shown ? "word-shown" : ""}`}
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
