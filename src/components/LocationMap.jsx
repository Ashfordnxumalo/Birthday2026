import React from "react";
import { config } from "../../config.js";
import Reveal from "./Reveal.jsx";

export default function LocationMap() {
  const query = encodeURIComponent(config.mapQuery);

  return (
    <section id="map" className="px-6 py-24" aria-label="Venue location">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-3xl text-gold sm:text-4xl">Find Us</h2>
        <div className="gold-divider mt-6" />
      </Reveal>

      <Reveal delay={0.1} className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-gold/30">
        <iframe
          title={`Map showing ${config.venueName}`}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        />
      </Reveal>
    </section>
  );
}
