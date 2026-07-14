import React from "react";
import { motion } from "framer-motion";
import { config } from "../../config.js";
import Particles from "./Particles.jsx";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      aria-label="Invitation hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep via-charcoal to-charcoal-light theme-light:from-champagne-light" />
      <Particles />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-6 text-xs uppercase tracking-[0.35em] text-gold-light sm:text-sm"
      >
        You are cordially invited
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 font-display text-5xl font-semibold leading-tight text-gradient-gold sm:text-7xl md:text-8xl"
      >
        {config.honoreeName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="relative z-10 mt-4 font-serif text-2xl italic text-ivory/90 sm:text-3xl"
      >
        {config.milestone}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 mt-2 text-sm tracking-wide text-ivory/60 sm:text-base"
      >
        {config.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 1.05 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-3"
      >
        <div className="gold-divider" />
        <p className="font-display text-3xl tracking-wide text-gold sm:text-4xl">
          {config.displayDate}
        </p>
        <p className="text-sm tracking-wide text-ivory/70 sm:text-base">
          {config.displayTime}
        </p>
        <div className="gold-divider" />
      </motion.div>

      <motion.a
        href="#rsvp"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="focus-gold relative z-10 mt-12 rounded-full border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-charcoal-deep"
      >
        RSVP Now
      </motion.a>
    </section>
  );
}
