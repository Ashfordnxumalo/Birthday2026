import React from "react";
import { useTheme } from "../lib/ThemeContext.jsx";
import { config } from "../../config.js";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  if (!config.showThemeToggle) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "champagne" : "charcoal"} theme`}
      className="focus-gold fixed left-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-charcoal-light/70 theme-light:bg-champagne/70 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-charcoal-deep"
    >
      {theme === "dark" ? "☾" : "☀"}
    </button>
  );
}
