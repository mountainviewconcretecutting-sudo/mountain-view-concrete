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
          DEFAULT: "#1E2022", // Industrial Slate Charcoal — primary dark surface
          soft: "#2A2D30",
          hard: "#141516",
        },
        orange: {
          DEFAULT: "#E85D04", // Safety / Sunset Orange — primary action color
          hover: "#C94E02",
          soft: "#FDECDF",
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
