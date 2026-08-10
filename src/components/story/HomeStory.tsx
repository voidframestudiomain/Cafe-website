"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/cafe/config";
import Magnetic from "@/components/motion/Magnetic";
import IntroLoader from "@/components/motion/IntroLoader";

gsap.registerPlugin(ScrollTrigger);

export interface Signature {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

/* ——— tiny helpers ——— */

function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-label={text} className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="char">
          {ch}
        </span>
      ))}
    </span>
  );
}

function CircleBadge({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 120 120" className="spin-slow h-28 w-28 sm:h-36 sm:w-36">
      <defs>
        <path id="circ" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        <linearGradient id="chrome-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chrome-hi)" />
          <stop offset="50%" stopColor="var(--chrome-mid)" />
          <stop offset="100%" stopColor="var(--lido)" />
        </linearGradient>
      </defs>
      {/* aperitivo porthole: chrome rim, lido face */}
      <circle cx="60" cy="60" r="58" fill="url(#chrome-rail)" stroke="var(--marine)" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="51" fill="var(--lido)" stroke="var(--marine)" strokeWidth="1.5" />
      <text className="fill-[var(--marine)] text-[13.5px] font-bold uppercase tracking-[0.22em]">
        <textPath href="#circ">{text}</textPath>
      </text>
      {/* citrus-slice center */}
      <circle cx="60" cy="60" r="24" fill="var(--aperol)" stroke="var(--marine)" strokeWidth="2.5" />
      <path
        d="M60 60 L82 60 M60 60 L38 60 M60 60 L60 82 M60 60 L60 38 M60 60 L75.6 75.6 M60 60 L44.4 44.4 M60 60 L75.6 44.4 M60 60 L44.4 75.6"
        stroke="var(--lido)"
        strokeWidth="2"
      />
      <circle cx="60" cy="60" r="4.5" fill="var(--lido)" stroke="var(--marine)" strokeWidth="1.5" />
    </svg>
  );
}

const MANIFESTO = ["Good beans.", "Real butter.", "No shortcuts."];

const CRAFT = [
  { emoji: "☀️", title: "Roast", desc: "Single-estate beans, roasted small every Tuesday", bg: "var(--sky)", rot: "-3deg", light: false },
  { emoji: "🥐", title: "Bake", desc: "72-hour laminates from a 5 AM oven", bg: "var(--limoncello)", rot: "2deg", light: false },
  { emoji: "🍋", title: "Cook", desc: "A short menu the morning market writes", bg: "var(--lido)", rot: "-2deg", light: false },
  { emoji: "☕", title: "Pour", desc: "Slow bar — pour overs, cold brew, affogato", bg: "var(--marine)", rot: "3deg", light: true },
];

/* Day scene: night-swim water deepens continuously between these stops */
const MOMENTS = [
  { time: "05:00", cap: "first swim", title: "The ovens wake first", body: "Laminated dough goes in before sunrise. By seven the room smells like butter.", bg: "#134e63" },
  { time: "07:30", cap: "granita o'clock", title: "First pour", body: "Doors open. Regulars don't order — they nod. The machine finds its rhythm.", bg: "#10475c" },
  { time: "12:30", cap: "aperitivo ora", title: "The kitchen takes over", body: "Plates leave the pass in waves. Lunch runs long here and nobody minds.", bg: "#0c3a4a" },
  { time: "19:00", cap: "night swim", title: "Golden hour", body: "Lights drop, vinyl goes on, dessert outsells coffee. Stay for the cheesecake.", bg: "#07242e" },
];

/* splash curtain: piscina panel leads, marine panel trails ~80ms behind */
const SPLASH_CURTAIN = "linear-gradient(180deg, var(--piscina) 0 90%, var(--marine) 90% 100%)";

const ROOM = [
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&q=80", cap: "The counter", rot: "-3deg", curtain: SPLASH_CURTAIN },
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1400&q=80", cap: "The window seats", rot: "2.5deg", curtain: SPLASH_CURTAIN },
  { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1400&q=80", cap: "The pass", rot: "-1.5deg", curtain: SPLASH_CURTAIN },
];

const TICKER = ["APERITIVO", "ESPRESSO FREDDO", "GRANITA DI CAFFÈ", "DIVE IN", "SALT & CITRUS", "POOLSIDE", "DAL 1962"];

const COORDS = "41.23° N — 2.11° E";

/* 05:00 → 19:00 as continuous minutes, snapped to 5 */
function formatDayTime(p: number): string {
  const mins = 300 + p * 840;
  const snapped = Math.round(mins / 5) * 5;
  const h = Math.floor(snapped / 60);
  const m = snapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* decorative pool-light caustic for dark scenes */
function Caustic({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={`caustic pointer-events-none absolute ${className}`}
      style={{ background: "radial-gradient(closest-side, rgba(111,214,207,0.07), transparent 70%)" }}
    />
  );
}

export default function HomeStory({ signatures }: { signatures: Signature[] }) {
  const root = useRef<HTMLDivElement>(null);
  const heroGrow = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dishesPin = useRef<HTMLDivElement>(null);
  const ghostDish = useRef<HTMLParagraphElement>(null);
  const daySection = useRef<HTMLElement>(null);
  const sunArm = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const dishCounter = useRef<HTMLSpanElement>(null);
  const [moment, setMoment] = useState(0);

  /* Cursor 3D tilt for cards */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = Array.from(
      root.current?.querySelectorAll<HTMLElement>(".tilt-card") ?? []
    );
    const cleanups = cards.map((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
      };
      const onLeave = () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" });
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      return () => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    ScrollTrigger.config({ ignoreMobileResize: true });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        /* ——— Hero: chars bounce, image pops, then grows to full-bleed
               (pure transform scale — zero layout reflow, buttery) ——— */
        gsap.from(".hero-char .char", {
          y: 140,
          rotation: () => gsap.utils.random(-14, 14),
          opacity: 0,
          duration: 1.1,
          ease: "back.out(1.6)",
          stagger: 0.045,
        });
        gsap.from(heroImg.current, {
          y: 120,
          opacity: 0,
          duration: 1.2,
          delay: 0.4,
          ease: "power3.out",
        });
        gsap.fromTo(
          heroGrow.current,
          { scale: 0.72 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: heroGrow.current, start: "top 78%", end: "top 8%", scrub: 1.2 },
          }
        );
        gsap.to(".hero-frame", {
          borderRadius: "1rem",
          ease: "none",
          scrollTrigger: { trigger: heroGrow.current, start: "top 78%", end: "top 8%", scrub: 1.2 },
        });
        gsap.utils.toArray<HTMLElement>(".float-shape").forEach((el, i) => {
          gsap.to(el, {
            y: (i % 2 ? -1 : 1) * gsap.utils.random(60, 140),
            rotation: gsap.utils.random(-30, 30),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=1200", scrub: 1.8 },
          });
        });

        /* ——— Velocity lean: marquee bands only (decorative — no text warp) ——— */
        const bands = gsap.utils.toArray<HTMLElement>(".band-drift");
        const bandSkew = bands.map((el) =>
          gsap.quickTo(el, "skewY", { duration: 0.6, ease: "power3.out" })
        );
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = gsap.utils.clamp(-2, 2, self.getVelocity() / -600);
            bandSkew.forEach((to) => to(skew));
          },
        });

        /* ——— Manifesto: text-fill wipes ——— */
        gsap.utils.toArray<HTMLElement>(".fill-line .solid").forEach((el) => {
          gsap.to(el, {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".fill-line"),
              start: "top 82%",
              end: "top 45%",
              scrub: 0.8,
            },
          });
        });

        /* ——— Marquee bands drift with scroll ——— */
        bands.forEach((el, i) => {
          gsap.fromTo(
            el,
            { x: i % 2 ? -70 : 70 },
            {
              x: i % 2 ? 70 : -70,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
            }
          );
        });

        /* ——— Craft stickers: soft flip-in ——— */
        gsap.from(".craft-card", {
          rotationY: 32,
          y: 70,
          opacity: 0,
          transformOrigin: "center bottom",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".craft-grid", start: "top 80%" },
        });

        /* ——— Pinned horizontal dishes + ghost name + inner parallax ——— */
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth;
        let lastIdx = -1;
        const horizontal = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: dishesPin.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1.3,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(
                signatures.length,
                Math.max(1, Math.round(self.progress * (signatures.length - 1)) + 1)
              );
              if (dishCounter.current) dishCounter.current.textContent = `${i}`;
              if (i !== lastIdx && ghostDish.current) {
                lastIdx = i;
                ghostDish.current.textContent = signatures[i - 1].name;
                gsap.fromTo(
                  ghostDish.current,
                  { yPercent: 12, opacity: 0 },
                  { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", overwrite: "auto" }
                );
              }
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".dish-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: horizontal,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        /* ——— Day: FULL-SCREEN sky, continuous color + ticking clock + sun arc ——— */
        const skyColor = gsap.utils.interpolate(MOMENTS.map((m) => m.bg));
        let lastMoment = -1;
        ScrollTrigger.create({
          trigger: daySection.current,
          start: "top top",
          end: "+=2800",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (daySection.current) {
              daySection.current.style.backgroundColor = skyColor(p);
            }
            if (clock.current) clock.current.textContent = formatDayTime(p);
            if (sunArm.current) {
              sunArm.current.style.transform = `rotate(${-80 + p * 160}deg)`;
            }
            const i = Math.min(MOMENTS.length - 1, Math.floor(p * MOMENTS.length));
            if (i !== lastMoment) {
              lastMoment = i;
              setMoment(i);
            }
          },
        });

        /* ——— Room polaroids: colored curtain wipes ——— */
        gsap.utils.toArray<HTMLElement>(".room-card").forEach((el, i) => {
          const curtain = el.querySelector(".curtain");
          const img = el.querySelector("img");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 85%" },
            delay: i * 0.15,
          });
          tl.from(el, { y: 90, opacity: 0, duration: 0.6, ease: "power3.out" })
            .to(curtain, { yPercent: -101, duration: 0.8, ease: "power4.inOut" }, "-=0.2")
            .from(img, { scale: 1.35, duration: 1.1, ease: "power3.out" }, "<");
        });

        /* ——— Epilogue chars ——— */
        gsap.from(".epi-char .char", {
          y: 120,
          opacity: 0,
          rotation: () => gsap.utils.random(-12, 12),
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.05,
          scrollTrigger: { trigger: ".epilogue", start: "top 70%" },
        });

        /* ——— Caustic drift: pool light in the dark scenes (decorative only) ——— */
        gsap.utils.toArray<HTMLElement>(".caustic").forEach((el, i) => {
          gsap.to(el, {
            x: "+=60",
            y: "-=40",
            duration: 14,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 1.7,
          });
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const band = (variant: "light" | "dark", rotate: string) => {
    const dark = variant === "dark";
    const chromeRule = (
      <div
        aria-hidden
        style={{ height: "1.5px", background: "linear-gradient(90deg, var(--chrome-hi), var(--chrome-mid), var(--lido))" }}
      />
    );
    const sep = (i: number) =>
      i % 3 === 1 ? (
        <span
          aria-hidden
          className={`mx-4 inline-block h-[0.9em] w-[0.9em] rounded-full border-[2.5px] bg-[var(--aperol)] align-middle ${
            dark ? "border-[rgba(238,247,244,0.4)]" : "border-[var(--marine)]"
          }`}
        />
      ) : (
        <span aria-hidden className={`mx-4 ${dark ? "text-[var(--piscina)]" : "text-[var(--marine)]"}`}>
          {i % 3 === 0 ? "✺" : "◠"}
        </span>
      );
    return (
      <div className="overflow-hidden py-6" style={{ transform: `rotate(${rotate})`, margin: "0 -2rem" }}>
        <div className="band-drift will-change-transform">
          {dark && chromeRule}
          <div
            className={`marquee py-3 ${dark ? "" : "border-y-[2.5px] border-[var(--marine)]"}`}
            style={{
              background: dark
                ? "var(--abyss)"
                : "repeating-linear-gradient(90deg, var(--sky) 0 56px, var(--lido) 56px 112px)",
            }}
          >
            {[false, true].map((hidden) => (
              <div key={String(hidden)} className="marquee-track" aria-hidden={hidden}>
                {TICKER.map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className={`font-display whitespace-nowrap text-2xl sm:text-4xl ${
                      dark ? "outline-text-dark" : i % 2 ? "outline-text" : "text-[var(--marine)]"
                    }`}
                  >
                    {item} {sep(i)}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {dark && chromeRule}
        </div>
      </div>
    );
  };

  return (
    <div ref={root}>
      <IntroLoader />

      {/* ————— HERO ————— */}
      <section className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-6 sm:pt-40">
        <span className="float-shape absolute left-[8%] top-40 text-5xl">🥐</span>
        <span className="float-shape absolute right-[12%] top-56 text-4xl">☕</span>
        <span className="float-shape absolute left-[18%] top-[520px] hidden text-4xl sm:block">🍋</span>
        <span className="float-shape absolute right-[6%] top-[420px] h-8 w-8 rounded-full bg-[var(--aperol)]" />
        <span className="float-shape absolute left-[45%] top-36 h-5 w-5 rounded-full bg-[var(--piscina)]" />

        <div className="mx-auto max-w-[1500px]">
          <p className="label mb-4 text-center">Open all summer — cold espresso, colder water.</p>
          <h1 className="font-display text-center text-[19vw] uppercase leading-[0.85] sm:text-[13.5vw]">
            <Chars text={siteConfig.name} className="hero-char" />
          </h1>
          <p className="font-display mt-2 text-center text-[6vw] text-[var(--aperol)] sm:text-[3vw]">
            <Chars text="coffee & kitchen" className="hero-char" />
          </p>
          <div aria-hidden className="shimmerline mx-auto mt-5 w-48 sm:w-72" />

          {/* full-width container, scaled down then grown via transform only */}
          <div
            ref={heroGrow}
            className="relative mx-auto mt-10 w-full will-change-transform"
            style={{ transform: "scale(0.72)", transformOrigin: "50% 20%" }}
          >
            <div ref={heroImg} className="hero-frame sticker overflow-hidden !rounded-[2.5rem] bg-[var(--lido)]">
              <div className="curtain-wrap relative aspect-[16/8]">
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=2400&q=80"
                  alt="Inside Meridian at golden hour"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -right-2 -top-10 sm:right-6">
              <CircleBadge text="APERITIVO ORA — MERIDIAN LIDO — " />
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-[15px] font-medium leading-relaxed">
            Coffee we roast ourselves, bread from a 5 AM oven, and a kitchen that
            cooks whatever the market woke up with. Scroll — it&apos;s a whole thing. ↓
          </p>
        </div>
      </section>

      {/* ————— MANIFESTO: text-fill wipes ————— */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1500px]">
          <p className="label">
            The whole philosophy<span className="opacity-60"> · {COORDS}</span>
          </p>
          <div aria-hidden className="shimmerline mt-3 w-16" />
          <h2 className="font-display mt-6 text-[11vw] uppercase leading-[0.95] sm:text-[7.5vw]">
            {MANIFESTO.map((line) => (
              <span key={line} className="fill-line">
                <span className="ghost">{line}</span>
                <span className="solid" aria-hidden>
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </section>

      {band("light", "-2deg")}

      {/* ————— THE CRAFT ————— */}
      <section className="px-4 py-20 sm:px-6">
        <div className="blob-section mx-auto max-w-[1500px] bg-[var(--piscina)] px-6 py-16 sm:px-14 sm:py-24">
          <p className="label">
            Chapter one<span className="opacity-60"> · {COORDS}</span>
          </p>
          <div aria-hidden className="shimmerline mt-3 w-16" />
          <h2 className="font-display mt-4 max-w-3xl text-4xl uppercase sm:text-7xl">
            Four things.
            <br />
            Zero <span className="accent-italic">shortcuts.</span>
          </h2>
          <div className="craft-grid tilt-wrap mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT.map((item) => (
              <div
                key={item.title}
                className="craft-card tilt-card sticker p-6"
                style={{ background: item.bg, transform: `rotate(${item.rot})` }}
              >
                <span className="craft-emoji text-4xl">{item.emoji}</span>
                <h3 className={`font-display tilt-pop mt-4 text-3xl ${item.light ? "text-[var(--lido)]" : ""}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 text-sm font-medium leading-relaxed ${item.light ? "text-[rgba(238,247,244,0.85)]" : "opacity-70"}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— PINNED DISHES ————— */}
      <section
        ref={dishesPin}
        className="relative overflow-hidden text-[var(--lido)]"
        style={{ background: "linear-gradient(180deg, var(--abyss) 0%, var(--ripple) 100%)" }}
      >
        <Caustic className="-left-[12vw] top-[8vh] h-[62vw] w-[62vw]" />
        <Caustic className="-right-[18vw] bottom-[4vh] h-[68vw] w-[68vw]" />
        <p ref={ghostDish} className="ghost-dish font-display text-[14vw] uppercase leading-none" />
        <div className="relative flex h-svh flex-col justify-center">
          <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="label text-[var(--piscina)]">
                  Chapter two — the table
                  <span className="text-[rgba(238,247,244,0.6)]"> · {COORDS}</span>
                </p>
                <div aria-hidden className="shimmerline mt-3 w-16" />
                <h2 className="font-display mt-3 text-4xl uppercase sm:text-6xl">
                  The greatest <span className="accent-italic">hits</span>
                </h2>
              </div>
              <p className="font-display text-5xl tabular-nums text-[var(--aperol)] sm:text-7xl">
                <span ref={dishCounter}>1</span>
                <span className="text-2xl text-[rgba(238,247,244,0.4)]">/{signatures.length}</span>
              </p>
            </div>
          </div>
          <div className="tilt-wrap">
            <div ref={track} className="flex w-max items-stretch gap-8 pl-4 pr-[24vw] will-change-transform sm:pl-6">
              {signatures.map((dish, i) => (
                <div
                  key={dish.name}
                  className="dish-card tilt-card dark-card relative w-[76vw] shrink-0 overflow-visible text-[var(--lido)] sm:w-[36vw] lg:w-[26vw]"
                  style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
                >
                  <div className="card-window relative aspect-[4/3] overflow-hidden rounded-t-[1.4rem]">
                    <div className="dish-img absolute inset-[-10%]">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 768px) 90vw, 32vw"
                        className="object-cover"
                        style={{ filter: "saturate(0.8) contrast(1.1) brightness(0.92)" }}
                      />
                    </div>
                    {/* moonlit-water grade */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-[1]"
                      style={{ background: "linear-gradient(180deg, rgba(7,36,46,0.45), rgba(16,71,92,0.30))", mixBlendMode: "multiply" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-[1]"
                      style={{ background: "linear-gradient(180deg, rgba(111,214,207,0.14), transparent 40%)", mixBlendMode: "screen" }}
                    />
                    <span className="label absolute left-3 top-3 z-[2] rounded-full border-2 border-[var(--marine)] bg-[var(--piscina)] px-3 py-1 text-[var(--marine)]">
                      {dish.category}
                    </span>
                  </div>
                  <div className="price-badge absolute -right-4 top-[52%] z-10 sm:-right-5">
                    <span className="tilt-pop">₹{dish.price}</span>
                  </div>
                  <div className="p-5 pr-16">
                    <h3 className="font-display tilt-pop text-2xl sm:text-3xl">{dish.name}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed opacity-70">
                      {dish.description}
                    </p>
                    <div className="card-reveal">
                      <div>
                        <p className="label mt-3 border-t-2 border-dotted border-[rgba(238,247,244,0.25)] pt-3 text-[var(--piscina)]">
                          Order at the counter →
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex w-[20vw] shrink-0 items-center">
                <Magnetic>
                  <Link href="/menu" className="pill-btn bg-[var(--limoncello)] px-8 py-4 text-[var(--marine)]">
                    Full menu →
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— ONE DAY HERE: full-screen night swim ————— */}
      <section
        ref={daySection}
        className="relative overflow-hidden text-[var(--lido)]"
        style={{ backgroundColor: MOMENTS[0].bg }}
      >
        <Caustic className="-left-[16vw] top-[4vh] h-[64vw] w-[64vw]" />
        <Caustic className="-right-[14vw] bottom-[2vh] h-[58vw] w-[58vw]" />
        {/* sun arcs across the whole viewport */}
        <div
          ref={sunArm}
          className="sun-arm"
          style={{ "--arc-r": "min(44vw, 620px)", transform: "rotate(-80deg)" } as React.CSSProperties}
        >
          <span
            aria-hidden
            className={`sun block${moment === 2 ? " golden" : ""}`}
            style={{ width: 28, height: 28, borderRadius: 999, background: "var(--limoncello)" }}
          />
        </div>

        <div className="relative mx-auto flex h-svh w-full max-w-[1500px] items-center px-4 sm:px-6">
          <div className="grid w-full gap-10 md:grid-cols-2">
            <div>
              <p className="label">
                Chapter three — one day here
                <span className="text-[rgba(238,247,244,0.6)]"> · {COORDS}</span>
              </p>
              <div aria-hidden className="shimmerline mt-3 w-16" />
              <p className="font-display mt-6 text-[21vw] leading-none tabular-nums text-[var(--aperol)] sm:text-[11rem]">
                <span ref={clock}>05:00</span>
              </p>
              <div className="squiggle-dark mt-6 max-w-xs" />
              <p className="label mt-6">Scroll to move the sun ↓</p>
            </div>
            <div className="flex flex-col justify-center">
              {MOMENTS.map((m, i) => (
                <div
                  key={m.time}
                  className={`py-4 transition-all duration-700 ${
                    i === moment ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className="label inline-block rounded-full px-3 py-1 text-[var(--abyss)]"
                    style={{ background: i === 2 ? "var(--aperol)" : i === 3 ? "var(--piscina)" : "var(--limoncello)" }}
                  >
                    {m.cap}
                  </span>
                  <h3 className="font-display mt-2 text-2xl sm:text-3xl">{m.title}</h3>
                  <div
                    className="grid transition-[grid-template-rows] duration-700 ease-out"
                    style={{ gridTemplateRows: i === moment ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-2 text-sm font-medium leading-relaxed opacity-80">
                        {m.body}
                      </p>
                    </div>
                  </div>
                  <div
                    aria-hidden
                    className="mt-4"
                    style={{ height: "1.5px", background: "linear-gradient(90deg, var(--chrome-hi), var(--chrome-mid), var(--lido))", opacity: 0.5 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {band("dark", "1.5deg")}

      {/* ————— THE ROOM (curtain reveals) ————— */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1500px]">
          <p className="label text-center">
            Chapter four — the room<span className="opacity-60"> · {COORDS}</span>
          </p>
          <div aria-hidden className="shimmerline mx-auto mt-3 w-16" />
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-center text-4xl uppercase sm:text-6xl">
            An old Goan house with very good <span className="accent-italic">light</span>
          </h2>
          <div className="tilt-wrap mt-16 grid gap-8 sm:grid-cols-3">
            {ROOM.map((img, i) => (
              <figure
                key={img.cap}
                className="room-card tilt-card sticker overflow-hidden bg-[var(--lido)] p-3 pb-5"
                style={{ transform: `rotate(${img.rot})` }}
              >
                <div className="card-window curtain-wrap relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image src={img.src} alt={img.cap} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  {/* striped-towel tint: odd tiles piscina, even tiles sky */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[1]"
                    style={{ background: i % 2 ? "rgba(191,230,238,0.12)" : "rgba(111,214,207,0.12)", mixBlendMode: "multiply" }}
                  />
                  <div className="curtain" style={{ background: img.curtain }} />
                </div>
                <figcaption className="tilt-pop pt-4 text-center text-sm font-bold">
                  {img.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ————— EPILOGUE ————— */}
      <section className="epilogue px-4 pb-28 sm:px-6">
        <div
          className="blob-section relative mx-auto max-w-[1500px] overflow-hidden px-6 py-20 text-center text-[var(--lido)] sm:px-14 sm:py-28"
          style={{ background: "linear-gradient(180deg, var(--abyss) 0%, var(--ripple) 100%)" }}
        >
          <Caustic className="-left-[10vw] -top-[6vh] h-[56vw] w-[56vw]" />
          <Caustic className="-bottom-[8vh] -right-[12vw] h-[60vw] w-[60vw]" />
          <p className="label text-[rgba(238,247,244,0.8)]">The end (of the website)</p>
          <h2 className="font-display mt-6 text-[13vw] uppercase leading-[0.9] sm:text-[7vw]">
            <Chars text="Come hungry." className="epi-char" />
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] font-medium leading-relaxed text-[rgba(238,247,244,0.9)]">
            The window seat is first-come. The cheesecake sells out. You have
            been warned, lovingly.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Magnetic>
              <Link
                href="/menu"
                className="pill-btn px-9 py-4"
                style={{ background: "var(--aperol)", color: "var(--abyss)", border: "none", boxShadow: "6px 6px 0 rgba(111,214,207,0.35)" }}
              >
                Read the menu
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/visit" className="pill-btn bg-[var(--lido)] px-9 py-4 text-[var(--marine)]">
                Find us
              </Link>
            </Magnetic>
          </div>
          <p className="label mt-10 text-[rgba(238,247,244,0.8)]">
            {siteConfig.hours[0][0]} · {siteConfig.hours[0][1]} · {siteConfig.address.split(",")[0]}
          </p>
        </div>
      </section>
    </div>
  );
}
