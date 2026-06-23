import React, { useMemo } from "react";
import { useReducedMotion } from "../lib/useReducedMotion.js";

export default function Particles({ count = 24 }) {
  const reduced = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gold animate-drift"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: "0 0 8px 2px rgba(212,175,55,0.6)",
          }}
        />
      ))}
    </div>
  );
}
