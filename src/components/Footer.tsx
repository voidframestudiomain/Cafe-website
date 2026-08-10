import Link from "next/link";
import { siteConfig } from "@/lib/cafe/config";
import Wave from "@/components/Wave";

export default function Footer() {
  return (
    <footer className="night-swim relative overflow-hidden">
      <style>{`
        @keyframes ftr-caustic-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(60px, -40px); }
        }
        .ftr-caustic {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(closest-side, rgba(111, 214, 207, 0.07), transparent 70%);
          animation: ftr-caustic-drift 14s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ftr-caustic { animation: none; }
        }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="ftr-caustic" style={{ width: "60vw", height: "60vw", left: "-15vw", top: "-10vw" }} />
        <div className="ftr-caustic" style={{ width: "70vw", height: "70vw", right: "-20vw", top: "20%", animationDelay: "-4.5s" }} />
        <div className="ftr-caustic" style={{ width: "55vw", height: "55vw", left: "25%", bottom: "-25vw", animationDelay: "-9s" }} />
      </div>
      <Wave flip className="text-sand" />
      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="label text-sun">Find us</p>
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
            <p className="label text-sun">Hours</p>
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
            <p className="label text-sun">Wander</p>
            <ul className="mt-3 space-y-2 text-sm font-bold">
              <li><Link href="/menu" className="transition-colors hover:text-mint">The menu →</Link></li>
              <li><Link href="/visit" className="transition-colors hover:text-mint">Come visit →</Link></li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="font-display outline-text-dark mt-16 select-none whitespace-nowrap text-center text-[17vw] leading-none sm:text-[12vw]"
        >
          {siteConfig.name}
          <span className="align-top text-[4vw]">☀</span>
        </p>

        <div className="chrome-rule mt-6" />
        <div className="mt-0 flex flex-wrap items-center justify-between gap-3 pt-5 text-xs opacity-60">
          <p>© {new Date().getFullYear()} {siteConfig.name} — made with salt &amp; citrus</p>
          <p>Assagao, Goa</p>
        </div>
      </div>
    </footer>
  );
}
