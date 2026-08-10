/** Site configuration — resolved from env vars. Rebrand via .env.local only. */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Creston's Food Junction",
  tagline: "kitchen & grill",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: "113 10th Ave N, Creston, BC V0B 1G0",
  phone: "+1 236-351-2011",
  email: "hello@crestonsfoodjunction.example",
  hours: [
    ["Mon – Fri", "7:30 — 22:00"],
    ["Saturday", "8:00 — 23:00"],
    ["Sunday", "8:00 — 21:00"],
  ] as Array<[string, string]>,
} as const;
