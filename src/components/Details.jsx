import React from "react";
import { config } from "../../config.js";
import Reveal from "./Reveal.jsx";

const CARDS = [
  {
    title: "Venue",
    lines: [config.venueName, config.venueAddress],
    icon: "🏛️",
  },
  {
    title: "Date & Time",
    lines: [config.displayDate, config.displayTime],
    icon: "🕰️",
  },
  {
    title: "Dress Code",
    lines: [config.dressCode, "Elegance is requested"],
    icon: "🎩",
  },
];

export default function Details() {
  return (
    <section id="details" className="px-6 py-24" aria-label="Event details">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-3xl text-gold sm:text-4xl">The Details</h2>
        <div className="gold-divider mt-6" />
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.15}>
            <div className="h-full rounded-xl border border-gold/30 bg-charcoal-light/50 theme-light:bg-champagne/50 p-8 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-gold">
              <div className="mb-4 text-3xl" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="font-display text-xl text-gold">{card.title}</h3>
              <div className="gold-divider my-4 w-12" />
              {card.lines.map((line) => (
                <p key={line} className="text-sm text-ivory/80 theme-light:text-charcoal-deep/80">
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
