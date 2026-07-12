"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const WORDS = ["beans.", "butter.", "bread."];
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Meridian";

/**
 * Opening curtain: cycles three words, stamps the wordmark, counts to 100,
 * then wipes up to reveal the site. Skipped for reduced-motion users and
 * repeat visits within the same session.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("meridian-intro")) return;
    sessionStorage.setItem("meridian-intro", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show || !overlay.current) return;
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setShow(false);
        },
      });

      // word cycle
      WORDS.forEach((_, i) => {
        tl.fromTo(
          `.intro-word-${i}`,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.38, ease: "power3.out" }
        ).to(`.intro-word-${i}`, {
          yPercent: -110,
          duration: 0.3,
          delay: 0.22,
          ease: "power3.in",
        });
      });

      // wordmark stamp
      tl.fromTo(
        ".intro-name .char",
        { y: 90, opacity: 0, rotation: () => gsap.utils.random(-12, 12) },
        { y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)", stagger: 0.035 }
      );

      // counter races to 100 alongside
      tl.to(
        counter.current,
        {
          innerText: 100,
          duration: 1.6,
          snap: { innerText: 1 },
          ease: "power2.inOut",
        },
        0
      );

      // curtain up
      tl.to(overlay.current, {
        yPercent: -100,
        duration: 0.9,
        delay: 0.25,
        ease: "power4.inOut",
      });
    }, overlay);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div ref={overlay} className="intro-overlay">
      <div className="relative h-16 overflow-hidden text-center sm:h-20">
        {WORDS.map((word, i) => (
          <p
            key={word}
            className={`intro-word-${i} font-display absolute inset-x-0 text-5xl text-[--butter] sm:text-6xl`}
            style={{ transform: "translateY(110%)" }}
          >
            {word}
          </p>
        ))}
        <p className="intro-name font-display absolute inset-x-0 text-5xl uppercase sm:text-6xl">
          {SITE_NAME.split("").map((ch, i) => (
            <span key={i} className="char" style={{ opacity: 0 }}>
              {ch}
            </span>
          ))}
        </p>
      </div>
      <span
        ref={counter}
        className="font-display absolute bottom-8 right-8 text-2xl tabular-nums text-[--butter]"
      >
        0
      </span>
    </div>
  );
}
