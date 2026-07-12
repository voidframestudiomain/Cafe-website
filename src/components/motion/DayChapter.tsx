"use client";

import { useRef, useState } from "react";
import { usePinProgress } from "./useScrollProgress";

const MOMENTS = [
  {
    time: "05:00",
    title: "The ovens wake first",
    body: "Laminated dough goes in before sunrise. By seven the room smells like butter and the first croissants are cooling on the pass.",
  },
  {
    time: "07:30",
    title: "First pour",
    body: "Doors open. The espresso machine finds its rhythm — regulars don't order, they nod. The morning papers disappear one by one.",
  },
  {
    time: "12:30",
    title: "The kitchen takes over",
    body: "Plates leave the pass in waves — orzo, burrata, whatever the market gave us. Lunch runs long here and nobody minds.",
  },
  {
    time: "19:00",
    title: "Golden hour",
    body: "The lights drop, the vinyl goes on, dessert outsells coffee. Stay for the Basque cheesecake — everyone does.",
  },
];

/** Pinned scene: scrolling walks through one day at the café, hour by hour. */
export default function DayChapter() {
  const outer = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  usePinProgress(outer, (p) => {
    setActive(Math.min(MOMENTS.length - 1, Math.floor(p * MOMENTS.length)));
    if (bar.current) bar.current.style.transform = `scaleY(${p})`;
  });

  return (
    <div ref={outer} className="h-[320vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-10 md:grid-cols-12">
          <div className="flex gap-8 md:col-span-5">
            <div className="relative hidden w-px bg-[#2e2822] md:block">
              <div
                ref={bar}
                className="absolute inset-x-0 top-0 h-full origin-top bg-[#efe9df]"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
            <div>
              <p className="index-num">Chapter 03 — One day here</p>
              <h2 className="font-display mt-6 text-4xl sm:text-6xl">
                From first bake
                <br />
                to last bite
              </h2>
              <p className="mt-6 max-w-sm text-[13px] leading-relaxed opacity-60">
                Scroll through a day at {`Meridian`} — it starts before you wake.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            {MOMENTS.map((moment, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <div
                  key={moment.time}
                  className={`border-b hairline py-6 transition-all duration-500 ${
                    isActive ? "opacity-100" : isPast ? "opacity-35" : "opacity-20"
                  }`}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-2xl tabular-nums sm:text-4xl">
                      {moment.time}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl">
                        {moment.title}
                      </h3>
                      <p
                        className={`mt-3 max-w-lg overflow-hidden text-[13px] leading-relaxed opacity-60 transition-all duration-700 ${
                          isActive ? "max-h-32" : "max-h-0 !opacity-0"
                        }`}
                      >
                        {moment.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
