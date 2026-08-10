import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/cafe/config";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Visit",
  description: "Hours, directions, and how to find us.",
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-32 sm:px-6 sm:pt-40">
      <p className="label text-center">
        Come over <span className="opacity-60">41.23° N — 2.11° E</span>
      </p>
      <h1 className="font-display mt-4 text-center text-5xl uppercase leading-[0.9] sm:text-8xl">
        Follow the smell
        <br />
        of <span className="accent-italic">butter</span>
        <span className="text-[var(--aperol)]">.</span>
      </h1>
      <div aria-hidden className="shimmerline mx-auto mt-6 w-44 rounded-full" />

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        <Reveal>
          <div className="sticker h-full bg-[var(--sky)] p-7" style={{ transform: "rotate(-1.5deg)" }}>
            <p className="label">Address</p>
            <p className="font-display mt-3 text-2xl leading-snug">
              {siteConfig.address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn mt-5 bg-[var(--lido)] px-6 py-2.5 text-sm"
            >
              Open in Maps →
            </a>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="sticker h-full bg-[var(--lido)] p-7" style={{ transform: "rotate(1.5deg)" }}>
            <p className="label">Hours</p>
            <ul className="mt-4">
              {siteConfig.hours.map(([day, time]) => (
                <li
                  key={day}
                  className="flex justify-between border-b-2 border-dotted border-[var(--marine)]/20 py-2.5 text-sm font-bold"
                >
                  <span>{day}</span>
                  <span className="tabular-nums">{time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium opacity-60">
              Walk-ins always welcome, any hour.
            </p>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="sticker h-full bg-[var(--piscina)] p-7" style={{ transform: "rotate(-1deg)" }}>
            <p className="label">Say hi</p>
            <p className="font-display mt-3 text-xl">{siteConfig.phone}</p>
            <p className="mt-1 text-sm font-medium">{siteConfig.email}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <div className="sticker overflow-hidden rounded-[2.5rem]! bg-[var(--lido)] p-3">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[1.8rem]">
            <Image
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=2400&q=80"
              alt="Inside the café"
              fill
              sizes="100vw"
              className="object-cover [filter:saturate(0.88)_brightness(1.04)_contrast(1.06)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,58,74,0.14), rgba(111,214,207,0.12))",
                mixBlendMode: "multiply",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{ background: "rgba(191,230,238,0.10)", mixBlendMode: "screen" }}
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
