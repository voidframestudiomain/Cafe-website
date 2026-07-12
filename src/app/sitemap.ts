import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/cafe/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/visit`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
