"use client";

import { useEffect, useState } from "react";

export interface Chapter {
  id: string;
  label: string;
}

/** Fixed chapter index on the right edge; tracks the section in view. */
export default function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const chapter of chapters) {
      const el = document.getElementById(chapter.id);
      if (!el) continue;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(chapter.id);
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      io.observe(el);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, [chapters]);

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="space-y-3 text-right">
        {chapters.map((chapter, i) => {
          const isActive = active === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={`group flex items-center justify-end gap-3 text-[11px] transition-colors ${
                  isActive ? "text-[--ink]" : "text-neutral-400"
                }`}
              >
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                    isActive
                      ? "max-w-40 opacity-100"
                      : "max-w-0 opacity-0 group-hover:max-w-40 group-hover:opacity-100"
                  }`}
                >
                  {chapter.label}
                </span>
                <span className="index-num">{String(i).padStart(2, "0")}</span>
                <span
                  className={`block h-px transition-all duration-500 ${
                    isActive ? "w-8 bg-[--ink]" : "w-4 bg-neutral-300"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
