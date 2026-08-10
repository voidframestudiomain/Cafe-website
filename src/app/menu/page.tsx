import type { Metadata } from "next";
import { getMenu, formatPrice } from "@/lib/cafe/data";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Menu",
  description: "Coffee, morning plates, the kitchen, the bakery, dessert.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Coffee: "var(--sky)",
  Morning: "var(--lido)",
  Eggs: "var(--sky)",
  Omelettes: "var(--lido)",
  Sides: "var(--sky)",
  Bowls: "var(--lido)",
  Plates: "var(--sky)",
  Starters: "var(--lido)",
  Burrito: "var(--sky)",
  "Wraps & Donair": "var(--lido)",
  Rice: "var(--sky)",
  Curry: "var(--lido)",
  Mithai: "var(--sky)",
  Bakery: "var(--lido)",
  Dessert: "var(--sky)",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-32 sm:px-6 sm:pt-40">
      <style>{`
        .ledger-row:hover .dotted-leader { border-bottom: 2px solid var(--piscina); }
        .ledger-row:hover .price-chip { transform: translateY(-2px); background: var(--limoncello); color: var(--marine); }
      `}</style>
      <p className="label text-center">
        The menu <span className="opacity-60">49.09° N — 116.51° W</span>
      </p>
      <h1 className="font-display mt-4 text-center text-5xl uppercase leading-[0.9] sm:text-8xl">
        Short on
        <br />
        <span className="accent-italic">purpose</span>
        <span className="text-[var(--aperol)]">.</span>
      </h1>
      <div aria-hidden className="shimmerline mx-auto mt-6 w-40 rounded-full" />
      <p className="mx-auto mt-6 max-w-sm text-center text-[15px] font-medium leading-relaxed opacity-70">
        The market writes it, we just cook it. Allergies? Tell us — the kitchen
        adapts gladly.
      </p>

      <div className="mt-20 space-y-14">
        {menu.map((section) => (
          <Reveal key={section.category}>
            <section
              className="sticker p-6 sm:p-10"
              style={{ background: CATEGORY_COLORS[section.category] ?? "var(--lido)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-3xl uppercase sm:text-5xl">
                  {section.category}
                </h2>
                <p className="label opacity-60">{section.note}</p>
              </div>
              <ul className="mt-8 space-y-5">
                {section.items.map((item) => (
                  <li key={item.name} className="ledger-row">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold sm:text-2xl">{item.name}</span>
                      <span className="dotted-leader" />
                      <span className="price-chip rounded-full px-2 text-xl font-semibold tabular-nums transition sm:text-2xl">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="mt-1 max-w-xl text-sm font-medium opacity-60">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
