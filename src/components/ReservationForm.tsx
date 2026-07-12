"use client";

import { useState } from "react";

export default function ReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, guests: Number(guests), when, note }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="sticker bg-[--butter] p-10 text-center">
        <p className="text-5xl">🎉</p>
        <p className="font-display mt-4 text-3xl uppercase">See you soon!</p>
        <p className="mt-2 text-sm font-medium opacity-70">
          We&apos;ll confirm on WhatsApp within the hour.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border-2 border-[--ink] bg-[--cream] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white";

  return (
    <form onSubmit={handleSubmit} className="sticker bg-white p-7 sm:p-9">
      <h2 className="font-display text-3xl uppercase">Grab a table</h2>
      <p className="mt-1 text-sm font-medium opacity-60">
        Takes 20 seconds. We confirm fast.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={field} />
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" aria-label="Phone" className={field} />
        <select value={guests} onChange={(e) => setGuests(e.target.value)} aria-label="Guests" className={field}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
          ))}
        </select>
        <input required type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Date and time" className={field} />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Occasion, allergies, window seat? (optional)"
        aria-label="Note"
        rows={3}
        className={`${field} mt-4`}
      />
      {status === "error" && (
        <p className="mt-3 text-sm font-bold text-[--tomato]">
          Could not send — please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="pill-btn mt-6 w-full bg-[--tomato] px-6 py-4 text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Request reservation →"}
      </button>
    </form>
  );
}
