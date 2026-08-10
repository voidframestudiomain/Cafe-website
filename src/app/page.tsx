import Image from "next/image";
import Link from "next/link";
import { getSignatures, formatPrice } from "@/lib/cafe/data";
import { siteConfig } from "@/lib/cafe/config";
import Reveal from "@/components/motion/Reveal";
import Wave from "@/components/Wave";

const SIGNATURE_IMAGES = [
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80",
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80",
];

const TICKER = [
  "Iced mango latte",
  "Cold brew tonic",
  "Ricotta hotcakes",
  "Burrata & peaches",
  "Basque cheesecake",
  "Seasonal sorbet",
];

const CRAFT = [
  { emoji: "☀️", title: "Roast", desc: "Single-estate beans, roasted in small batches every Tuesday.", bg: "bg-peach" },
  { emoji: "🥐", title: "Bake", desc: "72-hour croissants out of a 5 AM oven — usually gone by four.", bg: "bg-sun/60" },
  { emoji: "🍉", title: "Cook", desc: "A short, sunny menu the morning market writes for us.", bg: "bg-mint/70" },
  { emoji: "🧊", title: "Chill", desc: "Cold brew, iced teas and sorbet for the hottest hours.", bg: "bg-sky/80" },
];

const ROOM = [
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1400&q=80", cap: "The window seats", rot: "-rotate-2" },
  { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1400&q=80", cap: "The counter", rot: "rotate-1" },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80", cap: "The slow bar", rot: "-rotate-1" },
];

function Sun({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <g className="spin-slow" stroke="var(--color-sun)" strokeWidth="4" strokeLinecap="round">
        {rays.map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={50 + Math.cos(rad) * 32}
              y1={50 + Math.sin(rad) * 32}
              x2={50 + Math.cos(rad) * 44}
              y2={50 + Math.sin(rad) * 44}
            />
          );
        })}
      </g>
      <circle cx="50" cy="50" r="22" fill="var(--color-sun)" />
    </svg>
  );
}

function Ticker() {
  return (
    <div className="marquee awning-band -mx-2 -rotate-1 py-3.5 text-ocean">
      {[false, true].map((hidden) => (
        <div key={String(hidden)} className="marquee-track" aria-hidden={hidden}>
          {TICKER.map((item) => (
            <span key={item} className="font-display whitespace-nowrap text-2xl sm:text-3xl">
              {item} <span className="mx-3 text-coral">✺</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const signatures = (await getSignatures(5)).map((dish, i) => ({
    ...dish,
    image: SIGNATURE_IMAGES[i % SIGNATURE_IMAGES.length],
  }));

  return (
    <div>
      {/* ————— HERO ————— */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-40">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-sky/70 via-shell to-sand" />
        <div className="absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-sun/35 blur-3xl" />
        <div className="absolute -right-20 top-48 -z-10 h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
        <Sun className="absolute right-[6%] top-24 h-20 w-20 sm:h-32 sm:w-32" />

        <div className="mx-auto max-w-6xl text-center">
          <p className="label rise">A neighbourhood food junction in Creston, BC — est. 2019</p>
          <h1 className="font-display rise rise-1 mx-auto mt-5 max-w-4xl text-5xl uppercase sm:text-7xl lg:text-8xl">
            Big flavours, <em className="accent-italic">honest</em> plates
            <span className="text-coral">.</span>
          </h1>
          <div className="shimmerline rise rise-2 mx-auto mt-6 w-full max-w-xs rounded-full" />
          <p className="rise rise-2 mx-auto mt-6 max-w-md text-[15px] font-medium leading-relaxed opacity-80">
            House-roasted coffee, bread from a 5 AM oven, and a tandoor that
            never really cools down. Come as you are — leave a little
            fuller.
          </p>
          <div className="rise rise-3 mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/menu" className="btn btn-coral">See the menu</Link>
          </div>

          <div className="rise rise-4 relative mx-auto mt-14 max-w-5xl">
            <div className="card-soft overflow-hidden rounded-[2.5rem]! p-2.5">
              <div className="curtain-wrap relative aspect-video overflow-hidden rounded-4xl">
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=2400&q=80"
                  alt="Inside Creston's Food Junction at golden hour"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
              </div>
            </div>
            <span className="chip bob absolute -top-4 left-5 sm:left-8">
              ☀️ Open today · {siteConfig.hours[0][1]}
            </span>
            <span className="chip bob-late absolute -bottom-4 right-5 sm:right-8">
              🫓 The tandoor is going
            </span>
          </div>
        </div>
      </section>

      {/* ————— TICKER ————— */}
      <div className="overflow-hidden py-8">
        <Ticker />
      </div>

      {/* ————— WHAT WE DO ————— */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="label text-center">What we&apos;re about</p>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-center text-4xl uppercase sm:text-6xl">
              Four things, done <em className="accent-italic">slowly</em>
              <span className="text-coral">.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className={`card-soft card-lift h-full ${item.bg} p-7`}>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/80 text-3xl shadow-sm">
                    {item.emoji}
                  </span>
                  <h3 className="font-display mt-5 text-3xl">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed opacity-75">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— SUMMER FAVOURITES ————— */}
      <section>
        <Wave className="text-shell" />
        <div className="bg-shell px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="label">From the kitchen</p>
                  <h2 className="font-display mt-3 text-4xl uppercase sm:text-6xl">
                    Summer <em className="accent-italic">favourites</em>
                  </h2>
                </div>
                <p className="max-w-xs text-sm font-medium leading-relaxed opacity-70">
                  One signature from every corner of the menu. The cheesecake
                  sells out — you&apos;ve been warned, lovingly.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {signatures.map((dish, i) => (
                <Reveal key={dish.name} delay={(i % 3) * 100}>
                  <article className="card-soft card-lift group h-full overflow-hidden">
                    <div className="curtain-wrap relative aspect-4/3 overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="chip absolute left-4 top-4 py-1.5! text-xs uppercase tracking-wider">
                        {dish.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl">{dish.name}</h3>
                        <span className="shrink-0 rounded-full border-2 border-ocean bg-sun px-3.5 py-1.5 text-sm font-bold tabular-nums shadow-[2px_2px_0_var(--piscina)]">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-relaxed opacity-70">
                        {dish.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={200}>
                <Link
                  href="/menu"
                  className="card-soft card-lift flex h-full min-h-64 flex-col items-center justify-center gap-4 bg-coral p-8 text-center text-deep"
                >
                  <span className="text-4xl">🌊</span>
                  <span className="font-display text-3xl leading-tight">
                    Hungry yet?
                  </span>
                  <span className="btn btn-sun py-3! text-sm">Full menu →</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
        <Wave flip className="text-shell" />
      </section>

      {/* ————— THE PLACE ————— */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="label text-center">The place</p>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-center text-4xl uppercase sm:text-6xl">
              A corner spot with <em className="accent-italic">very good light</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {ROOM.map((img, i) => (
              <Reveal key={img.cap} delay={i * 120}>
                <figure className={`card-soft card-lift ${img.rot} overflow-hidden p-3 pb-5`}>
                  <div className="curtain-wrap relative aspect-4/5 overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={img.src}
                      alt={img.cap}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-4 text-center text-sm font-bold">
                    {img.cap}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CTA ————— */}
      <section className="px-4 pb-24 pt-8 sm:px-6">
        <Reveal>
          <div className="night-swim relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] px-6 py-20 text-center sm:rounded-[3rem] sm:py-24">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-mint/20 blur-2xl" />
            <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-coral/25 blur-2xl" />
            <p className="label relative text-mint">Weeknights · weekend rush · takeout too</p>
            <h2 className="font-display relative mt-5 text-5xl uppercase sm:text-7xl">
              Come get your <em className="accent-italic">fix</em>
              <span className="text-coral">.</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-[15px] font-medium leading-relaxed opacity-85">
              The window seat is first-come. The curry changes by the pot.
              The tandoor never really stops.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/menu" className="btn btn-sun">Read the menu</Link>
              <Link href="/visit" className="btn btn-coral">Find us</Link>
            </div>
            <div className="chrome-rule relative mx-auto mt-10 max-w-xs" />
            <p className="label relative mt-5 opacity-75">
              {siteConfig.hours[0][0]} · {siteConfig.hours[0][1]} · {siteConfig.address.split(",")[0]}
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
