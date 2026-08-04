/** The 6 brand color tokens exposed to the theme system, with their defaults. */
export const THEME_COLOR_DEFAULTS: Record<string, string> = {
  color_orange: "#E85D04",
  color_orange_hover: "#C94E02",
  color_orange_soft: "#FDECDF",
  color_charcoal: "#1E2022",
  color_charcoal_soft: "#2A2D30",
  color_charcoal_hard: "#141516",
};

/**
 * Converts a 6-digit hex color string to space-separated RGB channels
 * for use in Tailwind CSS variable color definitions.
 *
 * e.g. hexToRgbChannels("#E85D04") → "232 93 4"
 *
 * Tailwind's opacity modifier syntax (bg-orange/30) requires colors defined
 * as CSS variables to be in channel format so Tailwind can wrap them:
 *   rgb(var(--color-orange) / 0.3)
 */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex; // Fallback — return as-is if malformed
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
