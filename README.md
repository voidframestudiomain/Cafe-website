# Meridian — coffee & kitchen

An awwwards-style café website: scroll-driven storytelling, buttery Lenis
smooth scrolling, minimal Inter-only typography, and two pinned narrative
scenes — all on a tiny dependency footprint (next, react, lenis).

## Run it

```bash
cp .env.example .env.local   # optional — defaults built in
npm install
npm run dev                  # → http://localhost:3000
```

## Pages

| Route | What it does |
|---|---|
| `/` | The story: hero → The craft (word-reveal manifesto + ledger) → parallax → ticker → **The table** (pinned horizontal dish showcase, dark) → **One day here** (pinned hour-by-hour timeline, dark) → The room (gallery) → Visit epilogue |
| `/menu` | Full menu as indexed ledger rows with prices |
| `/visit` | Address, hours, contact + reservation form |
| `POST /api/reservations` | Validated + rate-limited; forwards to `RESERVATION_WEBHOOK_URL` or logs in dev |

## Motion system (`src/components/motion/`)

- `SmoothScroll` — Lenis inertia scrolling (lerp 0.09)
- `useScrollProgress` / `usePinProgress` — rAF scroll engine for everything below
- `TableShowcase` — pinned horizontal scroll scene with live counter
- `DayChapter` — pinned step-through timeline with progress rail
- `Parallax`, `WordReveal`, `Reveal`, `Marquee`, `ScrollProgressBar`, `ChapterNav`
- Every effect no-ops or falls back to static layout under `prefers-reduced-motion`

## Content

- Menu lives in `src/data/menu.json` — edit it, no code changes
- Brand/hours/address in `src/lib/cafe/config.ts` + `.env.local`
- Photos are Unsplash placeholders — swap freely (keep hosts in `next.config.ts` CSP + remotePatterns)

Security & SEO match the sibling projects: CSP + full headers, validated APIs,
robots + sitemap, per-page metadata.
