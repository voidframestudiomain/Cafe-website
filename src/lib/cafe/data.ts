/**
 * Data layer — the only module pages query. Swap the JSON for a CMS/API
 * later by reimplementing these functions; nothing else changes.
 */

import menuJson from "@/data/menu.json";

export interface MenuItem {
  name: string;
  description: string;
  price: number;
}

export interface MenuCategory {
  category: string;
  note: string;
  items: MenuItem[];
}

const menu = menuJson as MenuCategory[];

export async function getMenu(): Promise<MenuCategory[]> {
  return menu;
}

export async function getSignatures(limit = 6): Promise<
  Array<MenuItem & { category: string }>
> {
  // First item of each category = the signature
  return menu
    .map((c) => ({ ...c.items[0], category: c.category }))
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return `₹${price}`;
}
