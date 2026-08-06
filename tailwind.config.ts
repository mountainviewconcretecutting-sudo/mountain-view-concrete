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
        aggregate: {
          DEFAULT: "#1B1E22", // Cured Concrete Aggregate — dark mineral base
          deep: "#111316",
        },
        slurry: {
          DEFAULT: "#4A5057", // Wet Concrete Slurry — mid-tone mineral grey
          light: "#606770",
        },
        steel: {
          DEFAULT: "#9BA3AF", // Structural Steel Grey — metal machinery
          light: "#CBD1D9",
          dark: "#5B6266",
        },
        flame: {
          DEFAULT: "#FF5500", // Blade Flame Orange — STIHL/Husqvarna safety orange
          hover: "#E04B00",
          soft: "#3A1A0D",
        },
        ochre: {
          DEFAULT: "#D99B00", // Hazard Ochre — equipment safety yellow
          soft: "#332600",
        },
        chalk: {
          DEFAULT: "#F1F3F5", // Snap Chalk White — layout line contrast
          muted: "#A0A7B0",
        },
        charcoal: {
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
          DEFAULT: "#2D5A27",
          soft: "#E7EFE5",
        },
        fog: "#F5F5F2",
      },
      fontFamily: {
        display: ["var(--font-teko)", "var(--font-oswald)", "Impact", "sans-serif"],
        body: ["var(--font-barlow)", "var(--font-worksans)", "system-ui", "sans-serif"],
        tech: ["var(--font-chakra)", "var(--font-jetbrains)", "monospace"],
        mono: ["var(--font-chakra)", "var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        heavy: "6px 6px 0px #0F1115",
        "heavy-sm": "3px 3px 0px #0F1115",
        "heavy-flame": "4px 4px 0px #FF5500",
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
