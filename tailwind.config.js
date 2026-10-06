/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm ivory page and white cards.
        canvas: {
          DEFAULT: "#f8f4ec",
          light: "#fffdf9",
        },
        // Soft warm charcoal for text — gentler than pure black.
        ink: "#2e2924",
        gold: {
          DEFAULT: "#a58238", // headings, borders, icons
          deep: "#7f6123", // small text that must stay readable on ivory
          light: "#dcc48a", // soft fills behind ink text (buttons, pills)
        },
      },
      fontFamily: {
        display: ["'Cinzel'", "'Cormorant Garamond'", "serif"],
        script: ["'Pinyon Script'", "'Cormorant Garamond'", "cursive"],
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Jost'", "'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "gold-shimmer":
          "linear-gradient(120deg, #d4b46a 0%, #eedfb5 25%, #dcc48a 50%, #eedfb5 75%, #d4b46a 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: 0 },
          "10%": { opacity: 0.8 },
          "90%": { opacity: 0.8 },
          "100%": { transform: "translateY(-120vh) translateX(20px)", opacity: 0 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 8s linear infinite",
        drift: "drift 12s linear infinite",
        fadeUp: "fadeUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
