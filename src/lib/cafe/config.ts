/** Site configuration — resolved from env vars. Rebrand via .env.local only. */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Meridian",
  tagline: "coffee & kitchen",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: "14 Lantern Lane, Assagao, Goa 403507",
  phone: "+91 98220 44770",
  email: "hello@meridian.example",
  hours: [
    ["Mon – Fri", "7:30 — 22:00"],
    ["Saturday", "8:00 — 23:00"],
    ["Sunday", "8:00 — 21:00"],
  ] as Array<[string, string]>,
} as const;
