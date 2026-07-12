"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePinProgress, prefersReducedMotion } from "./useScrollProgress";

export interface Signature {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

/**
 * Pinned horizontal scene: vertical scroll drives the signature dishes
 * sideways across the table. Plain grid for reduced-motion users.
 */
export default function TableShowcase({ dishes }: { dishes: Signature[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => setStaticFallback(prefersReducedMotion()), []);

  usePinProgress(outer, (p) => {
    const t = track.current;
    if (!t) return;
    const distance = t.scrollWidth - window.innerWidth;
    t.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
    if (counter.current) {
      const i = Math.min(
        dishes.length,
        Math.max(1, Math.round(p * (dishes.length - 1)) + 1)
      );
      counter.current.textContent = `0${i}`;
    }
  });

  const card = (dish: Signature, i: number) => (
    <figure key={dish.name}>
      <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-neutral-800">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 78vw, 30vw"
          className="object-cover"
        />
      </div>
      <figcaption>
        <div className="flex items-baseline justify-between pt-4">
          <span className="index-num">
            0{i + 1} — {dish.category}
          </span>
          <span className="text-[13px] tabular-nums opacity-70">₹{dish.price}</span>
        </div>
        <p className="font-display border-b hairline pb-4 pt-1 text-2xl sm:text-3xl">
          {dish.name}
        </p>
        <p className="pt-3 text-[13px] leading-relaxed opacity-60">
          {dish.description}
        </p>
      </figcaption>
    </figure>
  );

  if (staticFallback) {
    return (
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-8 gap-y-16 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
        {dishes.map(card)}
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: `${dishes.length * 80}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-5 top-24 z-10 sm:left-10">
          <span className="index-num">
            <span ref={counter}>01</span> / 0{dishes.length}
          </span>
        </div>
        <div
          ref={track}
          className="flex w-max items-center gap-10 pl-5 pr-[22vw] will-change-transform sm:pl-10"
        >
          {dishes.map((dish, i) => (
            <div key={dish.name} className="w-[78vw] shrink-0 sm:w-[38vw] lg:w-[26vw]">
              {card(dish, i)}
            </div>
          ))}
          <div className="flex w-[22vw] shrink-0 items-center">
            <a href="/menu" className="link-sweep text-[13px]">
              Full menu ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
