import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// DESIGN TOKENS — Mountain View Concrete Cutting Inc.
// Palette is pinned by the client brief; everything else (type, layout,
// signature motif) is derived from it. See /DESIGN-NOTES.md for rationale.
// ---------------------------------------------------------------------------
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          // Values are CSS custom properties injected by RootLayout from theme_settings.
          // rgb(.../<alpha-value>) syntax is required for Tailwind opacity modifiers
          // (e.g. charcoal/95, bg-charcoal/10) to work correctly with CSS variables.
          DEFAULT: "rgb(var(--color-charcoal) / <alpha-value>)",
          soft: "rgb(var(--color-charcoal-soft) / <alpha-value>)",
          hard: "rgb(var(--color-charcoal-hard) / <alpha-value>)",
        },
        orange: {
          DEFAULT: "rgb(var(--color-orange) / <alpha-value>)",
          hover: "rgb(var(--color-orange-hover) / <alpha-value>)",
          soft: "rgb(var(--color-orange-soft) / <alpha-value>)",
        },
        mtnGreen: {
          DEFAULT: "#2D5A27", // Mountain Green — secondary accent
          soft: "#E7EFE5",
        },
        fog: "#F5F5F2", // crisp light background
        steel: {
          DEFAULT: "#5B6266", // mid-gray for secondary text / borders
          light: "#9AA0A3",
        },
      },
      fontFamily: {
        // Display: condensed, industrial, stencil-adjacent — signage voice
        display: ["var(--font-oswald)", "Impact", "sans-serif"],
        // Body: clean geometric grotesk — readability workhorse
        body: ["var(--font-worksans)", "system-ui", "sans-serif"],
        // Utility/data: monospace — spec sheets, measurements, blueprint feel
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        sawCut: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        revealUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        sawCut: "sawCut 1.4s cubic-bezier(0.65,0,0.35,1) forwards",
        revealUp: "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
