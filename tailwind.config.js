/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0d0d0f",
          light: "#16161a",
          deep: "#070708",
        },
        ivory: "#f4efe4",
        champagne: {
          DEFAULT: "#f3ead9",
          light: "#fbf6ec",
          deep: "#e7d9bd",
        },
        gold: {
          DEFAULT: "#D4AF37",
          deep: "#C9A227",
          light: "#e8cf7e",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "'Cormorant Garamond'", "serif"],
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Jost'", "'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "gold-shimmer":
          "linear-gradient(120deg, #C9A227 0%, #f3e3a3 25%, #D4AF37 50%, #f3e3a3 75%, #C9A227 100%)",
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
  plugins: [
    function ({ addVariant }) {
      addVariant("theme-light", ".theme-light &");
    },
  ],
};
