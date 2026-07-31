# Design Notes

## Palette (pinned by client brief — followed exactly)
- `#1E2022` Industrial Slate Charcoal — primary dark surface (header, footer, hero, alternating sections)
- `#E85D04` Safety/Sunset Orange — the one action color; used only for CTAs, links-on-hover, and small accents so it stays urgent
- `#2D5A27` Mountain Green — secondary accent, used sparingly (badges, one CTA band) to avoid competing with orange
- `#F5F5F2` Fog — light background, alternates with charcoal down the page

## Type
- **Display — Oswald**: condensed, heavy, signage-like. It's the typeface on a job-site sign or a piece of yellow equipment, not a generic geometric sans — matches an industrial trade rather than a generic SaaS look.
- **Body — Work Sans**: clean and highly readable at small sizes for service descriptions and form copy.
- **Utility/mono — JetBrains Mono**: used only for small structural labels ("eyebrows") and category tags — a nod to spec sheets and measurements (a company that quotes "up to 22 inches" and works in exact numbers).

## Signature element: the "cut line"
Every major section boundary is a diagonal blade-cut (`clip-path`) rather than
a straight edge — literally the shape of a saw cutting through material,
executed as a real structural device rather than a decorative gradient blob.
The hero additionally runs a single one-time animated "blade" of light
sweeping across on load — the only animation on the page, respecting
`prefers-reduced-motion`. Restraint: no hover-tilt cards, no parallax, no
scroll-jacking — the cut motif is the one bold move, everything else is quiet
and functional.

## Layout
Alternating charcoal / fog bands down the homepage (Hero → TrustBadges →
SectorOverview → ServicesPreview → FeaturedProjects → CTA) create rhythm
without needing borders or shadows to separate sections — the cut-line and
color change do that work.

## What we deliberately avoided
- No warm cream + terracotta serif combo (common AI-generated default) —
  brief's own charcoal/orange/green palette was followed instead.
- No numbered "01/02/03" markers for services — the services aren't a
  sequence, so cards use icons + labels instead.
