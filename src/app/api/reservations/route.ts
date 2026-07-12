import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/reservations — table reservation requests.
 * Strict validation, length caps, per-IP rate limiting.
 * Delivery: RESERVATION_WEBHOOK_URL if set, else server log (dev).
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    if (hits.size > 10_000) hits.clear();
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

const PHONE = /^[+\d][\d\s\-()]{6,19}$/;

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests — try again in a minute" },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, phone, guests, when, note } = body as {
      name?: unknown;
      phone?: unknown;
      guests?: unknown;
      when?: unknown;
      note?: unknown;
    };

    if (
      typeof name !== "string" || !name.trim() || name.length > 100 ||
      typeof phone !== "string" || !PHONE.test(phone.trim()) ||
      typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > 20 ||
      typeof when !== "string" || !when || when.length > 40 || Number.isNaN(Date.parse(when))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid reservation details" },
        { status: 400 }
      );
    }
    if (note !== undefined && (typeof note !== "string" || note.length > 1000)) {
      return NextResponse.json(
        { success: false, error: "Invalid note" },
        { status: 400 }
      );
    }

    const reservation = {
      name: name.trim(),
      phone: phone.trim(),
      guests,
      when,
      note: typeof note === "string" ? note.trim() : "",
      receivedAt: new Date().toISOString(),
    };

    const webhook = process.env.RESERVATION_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error("Reservation webhook failed:", res.status);
        return NextResponse.json(
          { success: false, error: "Could not deliver — please call us" },
          { status: 502 }
        );
      }
    } else {
      console.log("New reservation:", JSON.stringify(reservation));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
