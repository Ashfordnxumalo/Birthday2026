import React from "react";
import { motion } from "framer-motion";
import { TABS } from "../lib/useTab.js";

export default function TabNav({ tab, onChange }) {
  return (
    <nav
      aria-label="Event sections"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]"
    >
      <div
        role="tablist"
        className="flex gap-1 rounded-full border border-gold/40 bg-canvas-light/80 p-1 shadow-[0_10px_40px_rgba(90,70,30,0.15)] backdrop-blur-md"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={`focus-gold relative rounded-full px-3 py-2.5 text-[0.65rem] uppercase tracking-[0.12em] transition-colors sm:px-6 sm:text-xs sm:tracking-[0.18em] ${
                active ? "text-ink" : "text-gold-deep hover:text-gold"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gold-shimmer bg-[length:200%_auto] animate-shimmer"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden="true" className="hidden sm:inline">{t.icon}</span>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
