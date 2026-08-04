# DESIGN.md — Mountain View Industrial UI Design System

> **Source of Truth for Design System & Refactoring**  
> *Extracted from Stitch Project: "Mountain View Industrial UI"*  
> *Theme: Rugged Sophistication*

---

## 1. Design Vision & Aesthetic
**Rugged Sophistication** — A bold blend of industrial grit and high-end precision. Designed for commercial contractors, developers, and municipal planners who value structural reliability, efficiency, and engineering excellence. 

### Key Characteristics
- **Aesthetic**: Modern Industrialism meets Brutalism. Heavy geometric shapes, tactile layering, and crisp cuts mirror the physical act of concrete sawing and structural demolition.
- **Corners & Geometry**: Strictly **Sharp (0px)** corners (`rounded-none`). No soft, generic rounded borders.
- **Signature Motif**: **45-Degree Cut / Saw Notch**. Applied to top-right corners of primary buttons, section transitions (`clip-path`), and key card accents.
- **Elevation**: Tactile layering with **Hard Shadows** (`4px 4px 0px 0px #0F172A`) instead of soft blurry drop-shadows.

---

## 2. Color Palette

| Token Name | Hex Code | Purpose & Usage |
|---|---|---|
| `primary` / `primary-container` | `#f97316` | **Safety Orange** — High-visibility primary action color for CTAs, focus indicators, and saw-cut accents. |
| `primary-dark` / `surface-tint` | `#9d4300` | Darker Orange for active states, hover transitions, and dark background accents. |
| `deep-slate` | `#0F172A` | Structural dark slate for navigation header, footer, dark section bands, and hard shadows. |
| `steel-border` | `#CBD5E1` | Mid-tone cool border gray for 1px structural outlines and card boundaries. |
| `concrete-gray` | `#E2E8F0` | Light industrial gray for secondary container fills and section backgrounds. |
| `surface` / `background` | `#f7f9fb` | Clean, high-contrast light blue-gray background. |
| `surface-container` | `#eceef0` | Section contrast containers and card background fills. |
| `surface-container-high` | `#e6e8ea` | Elevated hover surfaces and active state cards. |
| `surface-container-lowest` | `#ffffff` | Crisp pure white card and modal backgrounds. |
| `on-surface` | `#191c1e` | Deep dark charcoal for high-legibility body text. |
| `on-surface-variant` | `#584237` | Secondary text, subtitles, and spec details. |
| `error` | `#ba1a1a` | Form error states and alert notices. |

---

## 3. Typography System

| Usage Tier | Font Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| **Display Hero** | `Barlow Condensed` | `72px` (`4.5rem`) | `800` (ExtraBold) | `1.1` | `-0.02em` |
| **Headline Large** | `Barlow Condensed` | `48px` (`3.0rem`) | `700` (Bold) | `1.2` | `0.01em` |
| **Headline Medium** | `Barlow Condensed` | `32px` (`2.0rem`) | `700` (Bold) | `1.2` | Normal |
| **Body Large** | `Inter` | `18px` (`1.125rem`) | `400` (Regular) | `1.7` | Normal |
| **Body Medium** | `Inter` | `16px` (`1.0rem`) | `400` (Regular) | `1.6` | Normal |
| **Label / Eyebrow** | `JetBrains Mono` | `12px` (`0.75rem`) | `600` (SemiBold) | `1.0` | `0.1em` (Caps) |
| **Button Text** | `Barlow Condensed` | `16px` (`1.0rem`) | `700` (Bold) | `1.0` | `0.05em` (Caps) |

---

## 4. Layout, Grid & Spacing

- **Grid**: Desktop 12-column grid (`max-w-[1280px]`), Mobile 4-column grid.
- **Section Vertical Padding**:
  - Desktop: `8rem` (`128px` / `py-32` or `section-py`)
  - Mobile: `4rem` (`64px` / `py-16` or `section-py-mobile`)
- **Spacing Scale**:
  - `stack-sm`: `0.5rem` (8px)
  - `stack-md`: `1.0rem` (16px)
  - `stack-lg`: `2.0rem` (32px)
  - `gutter`: `1.5rem` (24px)
- **Section Transitions**: Diagonal saw-blade cut dividers using CSS `clip-path`:
  - Section bottom cut: `clip-path: polygon(0 0, 100% 0, 100% 90%, 0% 100%)`

---

## 5. Component Style Specifications

### Buttons
- **Primary Button**:
  - Background: Safety Orange (`#f97316`).
  - Text: White, `Barlow Condensed` uppercase bold.
  - Border Radius: `0px` (`rounded-none`).
  - Notch Motif: `clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)`.
  - Hover: Darker orange (`#9d4300`) with hard shadow offset (`4px 4px 0px #0F172A`).
- **Secondary Button**:
  - Background: Transparent.
  - Border: 2px solid Deep Slate (`#0F172A`).
  - Text: Deep Slate, `Barlow Condensed` bold.
  - Border Radius: `0px` (`rounded-none`).
  - Hover: Deep Slate background (`#0F172A`) with White text.

### Cards & Containers
- **Background**: Surface White (`#ffffff`) or Light Slate (`#f7f9fb`).
- **Border**: 1px solid Steel-Border (`#CBD5E1`).
- **Corners**: `0px` (`rounded-none`).
- **Shadow**: Hard shadow `box-shadow: 4px 4px 0px 0px rgba(15, 23, 42, 0.9)` on hover or accent state.

### Form Inputs & Textareas
- **Border**: 1px solid Steel-Border (`#CBD5E1`), `0px` rounded corners.
- **Focus State**: Safety Orange border (`#f97316`) with 1px inset glow.
- **Labels & Placeholders**: `JetBrains Mono` / `Inter`.

---

## 6. Implementation Guidelines for Refactoring
1. Configure Next.js font loaders in `app/layout.tsx` to load **Barlow Condensed**, **Inter**, and **JetBrains Mono**.
2. Update `tailwind.config.ts` design tokens:
   - Add `barlow` / `display` font family.
   - Add `inter` / `body` font family.
   - Add `jetbrains` / `mono` font family.
   - Update color variables and extended palette (`orange`, `deep-slate`, `steel-border`, `concrete-gray`, `surface`).
3. Update `app/globals.css` base classes, section padding, button component utilities, cut-path definitions, and hard shadow utilities.
4. Refactor main layout components (`Header`, `Footer`, `Hero`, `ServicesPreview`, `FeaturedProjects`, `TrustBadges`, `SectorOverview`, `CTA`, `QuoteModal`) to adhere strictly to sharp 0px corners, Barlow Condensed headings, top-right notched primary buttons, and hard slate shadows.
