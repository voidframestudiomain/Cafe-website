import Link from "next/link";
import { siteConfig } from "@/lib/cafe/config";

export default function Footer() {
  return (
    <footer className="bg-[--cocoa] px-4 pb-8 pt-20 text-[--cream] sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="label text-[--butter]">Find us</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-80">
              {siteConfig.address}
            </p>
            <p className="mt-3 text-sm opacity-80">
              {siteConfig.phone}
              <br />
              {siteConfig.email}
            </p>
          </div>
          <div>
            <p className="label text-[--butter]">Hours</p>
            <ul className="mt-3 space-y-1 text-sm opacity-80">
              {siteConfig.hours.map(([day, time]) => (
                <li key={day} className="flex max-w-xs justify-between gap-6">
                  <span>{day}</span>
                  <span className="tabular-nums">{time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-[--butter]">Wander</p>
            <ul className="mt-3 space-y-2 text-sm font-bold">
              <li><Link href="/menu" className="hover:text-[--butter]">The menu →</Link></li>
              <li><Link href="/visit" className="hover:text-[--butter]">Come visit →</Link></li>
              <li><Link href="/visit#reserve" className="hover:text-[--butter]">Grab a table →</Link></li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="font-display mt-16 select-none whitespace-nowrap text-center text-[18vw] leading-none text-[--butter] sm:text-[13vw]"
        >
          {siteConfig.name}
          <span className="align-top text-[4vw]">☺</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs opacity-60">
          <p>© {new Date().getFullYear()} {siteConfig.name} — made with butter</p>
          <p>Assagao, Goa</p>
        </div>
      </div>
    </footer>
  );
}
