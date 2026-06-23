import React, { useEffect, useState } from "react";
import { config } from "../../config.js";
import Reveal from "./Reveal.jsx";

function getTimeLeft() {
  const diff = new Date(config.eventDateISO).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown"
      className="relative px-6 py-24 text-center"
      aria-label="Countdown to the celebration"
    >
      <Reveal>
        <h2 className="font-display text-3xl text-gold sm:text-4xl">
          {timeLeft ? "Counting Down" : "Tonight's the Night"}
        </h2>
        <div className="gold-divider my-6" />
      </Reveal>

      {timeLeft ? (
        <div
          className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
          role="timer"
          aria-live="polite"
        >
          {UNITS.map((unit, i) => (
            <Reveal key={unit.key} delay={i * 0.1}>
              <div className="rounded-lg border border-gold/40 bg-charcoal-light/60 theme-light:bg-champagne/60 px-4 py-6 backdrop-blur-sm">
                <span className="block font-display text-4xl text-gold sm:text-5xl">
                  {String(timeLeft[unit.key]).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-ivory/60">
                  {unit.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={0.1}>
          <p className="font-serif text-2xl italic text-ivory/90">
            The celebration has begun — join us at {config.venueName}.
          </p>
        </Reveal>
      )}
    </section>
  );
}
