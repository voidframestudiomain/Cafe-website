"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Meridian";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/visit", label: "Visit" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border-[2.5px] border-ocean bg-sand/90 px-5 py-2.5 backdrop-blur-md transition-shadow duration-500 ${
          scrolled
            ? "shadow-[4px_4px_0_var(--piscina)]"
            : "shadow-[6px_6px_0_var(--piscina)]"
        }`}
      >
        <Link href="/" className="text-[15px] font-extrabold tracking-tight">
          {SITE_NAME}
          <span className="ml-1.5 inline-block h-2.5 w-2.5 rounded-full bg-coral align-middle" />
        </Link>

        <nav className="flex items-center gap-1.5 text-[13px] font-bold">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 decoration-mint decoration-[2.5px] underline-offset-4 transition-colors hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
