import type { Metadata } from "next";
import { getMenu, formatPrice } from "@/lib/cafe/data";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Menu",
  description: "Coffee, morning plates, the kitchen, the bakery, dessert.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Coffee: "var(--tomato)",
  Morning: "var(--butter)",
  Plates: "var(--pistachio)",
  Bakery: "#fff",
  Dessert: "#ffd7e0",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-32 sm:px-6 sm:pt-40">
      <p className="label text-center">The menu</p>
      <h1 className="font-display mt-4 text-center text-5xl uppercase leading-[0.9] sm:text-8xl">
        Short on
        <br />
        purpose<span className="text-[--tomato]">.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-sm text-center text-[15px] font-medium leading-relaxed opacity-70">
        The market writes it, we just cook it. Allergies? Tell us — the kitchen
        adapts gladly.
      </p>

      <div className="mt-20 space-y-14">
        {menu.map((section) => (
          <Reveal key={section.category}>
            <section
              className="sticker p-6 sm:p-10"
              style={{ background: CATEGORY_COLORS[section.category] ?? "#fff" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2
                  className={`font-display text-3xl uppercase sm:text-5xl ${
                    section.category === "Coffee" ? "text-white" : ""
                  }`}
                >
                  {section.category}
                </h2>
                <p className={`label ${section.category === "Coffee" ? "text-white/80" : "opacity-60"}`}>
                  {section.note}
                </p>
              </div>
              <ul className={`mt-8 space-y-5 ${section.category === "Coffee" ? "text-white" : ""}`}>
                {section.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-baseline">
                      <span className="font-display text-xl sm:text-2xl">{item.name}</span>
                      <span className="dotted-leader" />
                      <span className="font-display text-xl tabular-nums sm:text-2xl">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className={`mt-1 max-w-xl text-sm font-medium ${section.category === "Coffee" ? "text-white/80" : "opacity-60"}`}>
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
