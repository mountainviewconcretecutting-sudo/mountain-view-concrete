/**
 * Generates a URL-friendly slug from a text string.
 * Lowercases, trims, strips non-word characters, collapses whitespace/underscores to hyphens,
 * and trims leading/trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
