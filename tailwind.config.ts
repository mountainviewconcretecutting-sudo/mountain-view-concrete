import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// DESIGN TOKENS — Mountain View Industrial UI Design System
// Source of truth: /DESIGN.md (Theme: Rugged Sophistication)
// ---------------------------------------------------------------------------
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f97316",
          dark: "#9d4300",
          container: "#f97316",
        },
        "primary-dark": "#9d4300",
        "surface-tint": "#9d4300",
        "deep-slate": "#0F172A",
        "steel-border": "#CBD5E1",
        "concrete-gray": "#E2E8F0",
        surface: {
          DEFAULT: "#f7f9fb",
          container: "#eceef0",
          "container-high": "#e6e8ea",
          "container-lowest": "#ffffff",
        },
        "on-surface": {
          DEFAULT: "#191c1e",
          variant: "#584237",
        },
        error: "#ba1a1a",
        // Theme-injected CSS variable aliases (preserves dynamic DB theme settings compatibility)
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
        steel: {
          DEFAULT: "#5B6266",
          light: "#9AA0A3",
        },
      },
      fontFamily: {
        display: ["var(--font-barlow)", "Barlow Condensed", "Impact", "sans-serif"],
        barlow: ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        jetbrains: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #0F172A",
        "hard-lg": "6px 6px 0px 0px #0F172A",
        "hard-sm": "2px 2px 0px 0px #0F172A",
        "hard-orange": "4px 4px 0px 0px #f97316",
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
