import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal.jsx";

const PHOTO_COUNT = 6;

const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => ({
  id: i,
  src: `${import.meta.env.BASE_URL}photos/${i + 1}.jpeg`,
  alt: `Memory photo ${i + 1}`,
}));

export default function Gallery() {
  const [active, setActive] = useState(null);

  return (
    <section id="gallery" className="px-6 py-24" aria-label="Photo gallery">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-3xl text-gold sm:text-4xl">Memories</h2>
        <div className="gold-divider mt-6" />
      </Reveal>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
        {PHOTOS.map((photo, i) => (
          <Reveal key={photo.id} delay={(i % 4) * 0.08}>
            <button
              type="button"
              onClick={() => setActive(photo)}
              className="focus-gold block w-full overflow-hidden rounded-lg border border-gold/20"
              aria-label={`View ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
            onClick={() => setActive(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={active.src}
              alt={active.alt}
              className="max-h-[85vh] max-w-full rounded-lg border border-gold/40"
            />
            <button
              type="button"
              onClick={() => setActive(null)}
              className="focus-gold absolute right-6 top-6 text-3xl text-gold"
              aria-label="Close lightbox"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
