# PROJECT_CONTEXT.md — Mountain View Concrete Cutting Inc.

> **Project Architecture & Context Document**  
> *Last Updated: August 2026*

--- AFTER EVERY MAJOR CHANGE IN THE CODEBASE ADD THE CHANGES TO THIS FILE

## 1. Project Overview & Business Context

### Brief Summary
**Mountain View Concrete Cutting Inc.** (2549952 Alberta Inc.) is a full-stack marketing website and custom lightweight Content Management System (CMS) built for a commercial and residential concrete cutting contractor operating in Calgary and Western Alberta with 25+ years of industry experience.

### Core Purpose & Value Proposition
The primary objective of the site is to drive qualified quote requests, showcase 25+ years of structural concrete cutting, slab sawing, wall sawing, core drilling, and demolition expertise, and establish a high-trust digital presence with 24/7 emergency response branding.

### Key Features & Capabilities
- **Public Marketing Website**: High-performance, SEO-optimized public pages (`/`, `/about`, `/services`, `/projects`, `/contact`, `/updates`, `/privacy`, `/terms`) with a custom industrial slate & safety orange design system featuring dynamic diagonal saw-blade cut motifs (`clip-path`).
- **Inline Site Content Editing System**: Allows authenticated staff to edit core site text (e.g. hero tagline, subtext, company story, mission statement) directly on live public pages using inline rich-text controls without navigating to a separate CMS dashboard (`site_content` table).
- **Quote Lead Capture & Contact**: Interactive modal (`QuoteModal.tsx`) and dedicated contact form section (`ContactFormSection.tsx`) with bot-honeypot protection, Zod input validation, database storage (`leads` table), and automated transactional email alerts via Resend.
- **Testimonial Submission & Moderation**: Public-facing customer feedback form with admin approval workflow (`testimonials` table) before reviews publish to live homepage/projects pages.
- **Posts / Announcements CMS**: Full management of company news, announcements, and updates (`posts` table), featuring slug generation (`lib/utils/slugify.ts`), draft/publish status toggles, ISR public listing at `/updates`, dynamic detail pages at `/updates/[slug]`, and `PostsManager.tsx` admin component.
- **Services & Equipment CMS**: DB-driven service catalogue (`services` table) and machinery fleet inventory (`equipment` table). Server-side fetched on `/services` with fail-safe defaults (`lib/actions/services.ts`), managed via admin dashboard (`ServicesManager.tsx`, `EquipmentManager.tsx`).
- **Comments & Unified Moderation System**: Interactive comment forms on post detail pages (`/updates/[slug]`) and project cards (`/projects`), featuring bot honeypot protection, Zod validation, pending review workflow, connection-error safe service-role retries, and a unified admin moderation table (`CommentsTable.tsx`) for approving, rejecting, or deleting comments across both sources (`comments` table).
- **Live Theme Customizer**: Admin brand color adjustment panel (`theme_settings` table) via `ThemePanel.tsx`.
- **SEO & Technical Compliance**: Built-in dynamic XML sitemap (`app/sitemap.ts`), crawler rules (`app/robots.ts`), and LocalBusiness / GeneralContractor JSON-LD structured data in root layout.

---

## 2. Tech Stack & Dependencies

### Core Technical Architecture

| Layer | Technology | Version | Purpose & Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `15.1.0` | React Server Components for SEO, page load speed, and Server Actions for unified backend logic without API routes. |
| **Language** | TypeScript | `^5.6.3` | Strict type safety across client components, server actions, and database models. |
| **Styling** | Tailwind CSS | `^3.4.14` | Utility-first CSS configured for "Mountain View Industrial UI" (Rugged Sophistication): Barlow Condensed / Inter / JetBrains Mono font loaders, `#f97316` Safety Orange, `#0F172A` Deep Slate, hard shadows (`4px 4px 0px #0F172A`), `.notch-top-right`, `.cut-below`, and custom brand tokens. |
| **Database & Auth** | Supabase (Postgres) | `@supabase/supabase-js` `^2.45.4`<br>`@supabase/ssr` `^0.5.2` | Managed Postgres database with Row Level Security (RLS), Supabase Auth session handling, and server-role client overrides. |
| **Form Validation** | Zod | `^3.23.8` | Shared validation schemas for quote forms, testimonials, projects, posts, comments, services, and equipment. |
| **Icons** | Lucide React | `^0.454.0` | Lightweight SVG icons (`Pencil`, `CheckCircle2`, `Loader2`, `ImageOff`, `Plus`, `Trash2`, `Sparkles`, `Eye`, `EyeOff`, `Calendar`, `Newspaper`, `Upload`, etc.). |
| **Email Delivery** | Resend | `^4.0.1` | Transactional email notifications for newly submitted customer quote leads. |
| **Utilities** | `clsx` | `^2.1.1` | Conditional class joining for UI state handling. |

### Key Package Scripts & Development Tools
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "create-admin": "node --env-file=.env.local scripts/create-admin.mjs"
}
```

---

## 3. Directory & Architecture Blueprint

```
mountain-view-concrete-cutting/
└── mountain-view-concrete/
    ├── app/                            # Next.js App Router Page Directory
    │   ├── layout.tsx                  # Root layout: Fonts, JSON-LD Schema, EditModeProvider, Header, Footer, StickyCallBar
    │   ├── page.tsx                    # Homepage: Hero, TrustBadges, SectorOverview, Services, Projects, Testimonials, CTA
    │   ├── globals.css                 # Custom font imports & cut-above/cut-below clip-path rules
    │   ├── not-found.tsx               # Styled 404 page
    │   ├── sitemap.ts                  # Dynamic XML sitemap generator
    │   ├── robots.ts                   # Search engine crawler directives
    │   ├── about/                      # About Us page with editable company story and mission
    │   │   └── page.tsx
    │   ├── services/                   # Detailed service catalog & equipment fleet
    │   │   └── page.tsx
    │   ├── projects/                   # Portfolio showcase filterable by category
    │   │   └── page.tsx
    │   ├── updates/                    # Company Announcements & News Posts (ISR revalidate = 60)
    │   │   ├── page.tsx                # Listing page (/updates) — queries published posts ordered by created_at DESC
    │   │   └── [slug]/page.tsx         # Post detail page (/updates/[slug]) — dynamic SEO metadata, CommentsSection
    │   ├── contact/                    # Contact information, service area coverage, & quote form
    │   │   └── page.tsx
    │   ├── privacy/                    # Privacy Policy (PIRPA / Alberta compliance)
    │   │   └── page.tsx
    │   ├── terms/                      # Terms of Service
    │   │   └── page.tsx
    │   └── admin/                      # Protected Admin CMS Area
    │       ├── login/                  # Supabase Auth email/password portal
    │       │   └── page.tsx
    │       └── page.tsx                # Admin Dashboard (Leads, Comments, Testimonials, Services, Equipment, Projects, Posts, Theme)
    │
    ├── components/                     # Reusable React UI Components
    │   ├── Header.tsx                  # Desktop/mobile navigation with "Updates" link & request quote button
    │   ├── Footer.tsx                  # Site footer with service links, legal info, contact details
    │   ├── StickyCallBar.tsx           # Mobile persistent emergency call & quote action bar
    │   ├── QuoteModal.tsx              # Overlay modal quote submission form
    │   ├── edit-mode/                  # Inline Site Copy Editing Components
    │   │   ├── EditModeContext.tsx     # Context provider tracking admin state & edit mode toggle
    │   │   ├── EditModeToggle.tsx      # Floating action button to toggle edit mode ON/OFF
    │   │   └── EditableText.tsx        # Interactive wrapper for editable copy with Server Action save
    │   ├── home/                       # Homepage section components
    │   │   ├── Hero.tsx
    │   │   ├── TrustBadges.tsx
    │   │   ├── SectorOverview.tsx
    │   │   ├── ServicesPreview.tsx
    │   │   ├── FeaturedProjectsPreview.tsx
    │   │   ├── TestimonialsSection.tsx
    │   │   └── CtaBand.tsx
    │   ├── admin/                      # Admin dashboard client tables and managers
    │   │   ├── LeadsTable.tsx          # Lead management table with status updates
    │   │   ├── ProjectsManager.tsx     # Project CRUD with modal form & image URL handling
    │   │   ├── PostsManager.tsx        # Posts CRUD: card grid + modal form (title, slug, body, cover_image_url, is_published)
    │   │   ├── TestimonialsTable.tsx   # Testimonial moderation table (approve/reject)
    │   │   ├── CommentsTable.tsx       # Unified post & project comment moderation table
    │   │   ├── ThemePanel.tsx          # Brand color customization panel
    │   │   ├── ServicesManager.tsx     # Add/edit/delete services from the `services` table
    │   │   └── EquipmentManager.tsx    # Add/edit/delete equipment from the `equipment` table
    │   ├── comments/
    │   │   └── CommentsSection.tsx     # Public post/project comments list & submission form
    │   ├── contact/
    │   │   └── ContactFormSection.tsx  # Quote lead submission form section
    │   └── projects/
    │       ├── ProjectsGrid.tsx        # Filterable project portfolio grid with ImageOff fallback
    │       └── TestimonialSectionWithForm.tsx
    │
    ├── lib/                            # Application Logic, Database Clients, & Server Actions
    │   ├── types.ts                    # Shared domain TypeScript types (Lead, Project, Testimonial, Post, Comment, Service, Equipment, SiteContent)
    │   ├── utils/
    │   │   └── slugify.ts              # Slugify utility for posts/announcements
    │   ├── supabase/
    │   │   ├── server.ts               # SSR Supabase client (cookie-aware) & service-role client
    │   │   └── client.ts               # Browser Supabase client
    │   └── actions/                    # Server Actions (Mutations & Privileged Queries)
    │       ├── admin.ts                # Login, logout, lead status, testimonial moderation, project CRUD, post CRUD, service/equipment CRUD, comment moderation
    │       ├── services.ts             # getServices() / getEquipment() — public fail-safe fetchers with fallback defaults
    │       ├── siteContent.ts          # getIsAdmin, getSiteContent, getSiteContents, updateSiteContent
    │       ├── submitComment.ts        # Public comment submission handler with network connection fallback guard
    │       ├── submitQuote.ts          # Public lead form handler with Zod validation & Resend email trigger
    │       └── submitTestimonial.ts    # Public testimonial submission handler
    │
    ├── middleware.ts                   # Auth middleware protecting /admin/* and handling login redirects
    ├── scripts/
    │   └── create-admin.mjs            # CLI script to provision/update admin credentials in Supabase Auth & admin_profiles
    ├── supabase/
    │   └── schema.sql                  # Complete Database DDL (10 tables), Enum types, RLS policies (is_admin()), helper functions, seed data
    ├── public/                         # Static web assets (favicon, images, project photos)
    └── tailwind.config.ts              # Color palette, font variables, and custom theme tokens
```

---

## 4. Key Features & Design Patterns

### A. Inline Site Content Editing System
- **`EditModeContext.tsx`**: Wraps application layout. Unauthenticated users (`isAdmin=false`) experience zero editing overhead. Authenticated admins (`isAdmin=true`) see floating `EditModeToggle`.
- **`EditableText.tsx`**: Interactive wrapper for copy keys (e.g. `hero_tagline`, `about_story`). Hovering highlights text with a dashed orange border; clicking opens an inline rich textarea with `Ctrl+Enter` save shortcuts.
- **`lib/actions/siteContent.ts`**:
  - `getIsAdmin()`: Checks Supabase Auth session and verifies row in `admin_profiles`.
  - `getSiteContents(keys, defaults)`: Batch queries `site_content`; falls back to hardcoded defaults if DB is unreachable.
  - `updateSiteContent(key, value)`: Verifies admin auth, upserts into `site_content`, and calls `revalidatePath('/', 'layout')`.

### B. Authentication & Admin Flow
- **Supabase Auth Integration**: Email/password auth via `auth.users`.
- **Staff Verification**: Privileged capabilities are gated by `admin_profiles` table, verified via Postgres `is_admin()` SECURITY DEFINER function and application-layer `getIsAdmin()` server action guards.
- **Next.js Middleware (`middleware.ts`)**: Protects `/admin/*` sub-routes (except `/admin/login`).
- **CLI Provisioning Script (`scripts/create-admin.mjs`)**: Provisions staff credentials directly using `SUPABASE_SERVICE_ROLE_KEY`.

### C. Posts / Announcements CMS
- **Database**: `posts` table with unique `slug`, `title`, `body`, `cover_image_url`, `is_published`, `created_at`, `updated_at`, and RLS policy (`is_published = true` for public SELECT, `is_admin()` for ALL).
- **Admin UI**: `PostsManager.tsx` card grid with status badges, Eye/EyeOff publish toggle, Edit/Delete modals, and auto-slug generation via `slugify.ts`.
- **Public Listing & Detail**: `/updates` listing and `/updates/[slug]` detail page with ISR (`revalidate = 60`), `generateMetadata()` SEO, and `CommentsSection`.

### D. Services & Equipment Catalogue
- **Database**: `services` and `equipment` tables with ordering indexes and RLS (`is_admin()` for writes).
- **Fail-Safe Fetchers**: `lib/actions/services.ts` provides `getServices()` and `getEquipment()` that return database contents or fallback seamlessly to hardcoded defaults (`DEFAULT_SERVICES`, `DEFAULT_EQUIPMENT`).
- **Admin Management**: `ServicesManager.tsx` and `EquipmentManager.tsx` panels on the `/admin` dashboard.

### E. Comments & Unified Moderation
- **Public Submission**: `submitComment.ts` validates via Zod, accepts `post_id` or `project_id`, silently absorbs honeypot bots, and inserts status `pending`.
- **Network Error Fallback Safety**: Connection error filter (`isConnectionError()`) ensures standard database failures (RLS violations, constraint errors) never trigger `service-role` retries under elevated privileges.
- **Admin Moderation**: `CommentsTable.tsx` displays unified moderation panel across posts and projects for approving, rejecting, or deleting comments.

### F. Testimonials Moderation
- **Public Submission**: `submitTestimonial.ts` inserts customer rating and review with `pending` status.
- **Admin Moderation**: `TestimonialsTable.tsx` allows admins to approve or reject reviews before rendering on public pages (`TestimonialsSection.tsx`).

### G. Live Theme Customizer
- **Database**: `theme_settings` table storing hex color codes (`color_orange`, `color_charcoal`, etc.).
- **Admin UI**: `ThemePanel.tsx` allows brand color tweaking.
- **Runtime Styling**: Root layout reads color tokens, converts to RGB channels, and injects CSS custom properties to dynamically update Tailwind color definitions.

---

## 5. Strict AI Rules & Safety Guardrails

1. **NO Codebase Refactoring Without Explicit Instruction**: Do NOT alter working features, page routes, or layout structures without direct user request.
2. **Maintain Strict TypeScript Compliance**: Always define explicit types in `lib/types.ts`. Do NOT use `any` or disable strict checks.
3. **Asset & Path Verification**: Always verify local image paths in `public/` before referencing. Gracefully handle missing images with SVG placeholders (`ImageOff`).
4. **Security & Key Safeguards**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components (`"use client"`). Always retain `getIsAdmin()` guards in server actions.
5. **Server vs Client Boundaries**: Keep `"use client"` directives focused at the smallest interactive boundary. Retain Server Component rendering for top-level pages for SEO.

---

## 6. Environment & Setup Checklist

### Required Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_resend_api_key
LEAD_NOTIFICATION_EMAIL=crafuse0@gmail.com
```

### Setup Steps
1. **Install Dependencies**: `npm install`
2. **Database Initialization**: Run `supabase/schema.sql` in the Supabase SQL Editor.
3. **Provision Admin**: `npm run create-admin admin@mountainviewconcrete.ca Password123! "Admin User"`
4. **Dev Server**: `npm run dev`
5. **Production Build**: `npm run build`

---

## 7. Pre-Launch Deployment Checklist

Before deploying live to a custom domain (e.g. Vercel, Netlify, or custom VPS), complete these 3 steps:

1. **Production Database Migration**:
   - Run `supabase/schema.sql` in the production Supabase project (`jzzzlrsqmglkhyhmrqjq`).
2. **Provision Admin Account**:
   - Run `npm run create-admin admin@mountainviewconcrete.ca SecurePassword123! "Admin User"` pointing to production credentials.
3. **Set Production Environment Variables**:
   - Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `LEAD_NOTIFICATION_EMAIL` in hosting provider settings.

---

## 8. Upcoming Features & Technical Roadmap (Post-Launch / Priority)

### Admin Drag-and-Drop Image Uploader Component (`<ImageDropzone />`)
- **Objective**: Allow authenticated admins to drag and drop image files (`.jpg`, `.png`, `.webp`) directly inside CMS modals (`ProjectsManager`, `PostsManager`, `ServicesManager`, `EquipmentManager`) to automatically upload them to Supabase Storage and set target URL fields.
- **Architecture Requirements**:
  1. **Supabase Storage Bucket**: Create a public `site-images` bucket in Supabase with public READ access and admin-only WRITE access (`is_admin()`).
  2. **Re-usable Client Component**: Build `components/admin/ImageDropzone.tsx` supporting:
     - Drag over hover styling (dashed safety-orange border).
     - File size limit checks (e.g., max 5MB) & image format validation.
     - Live progress bar indicator during upload.
     - Auto-populating target image URL form state on upload completion.
  3. **Server Action / Storage Handler**: Server action or client upload handler using `supabase.storage.from("site-images").upload(...)`.

---

## 9. AI Maintenance & Update Mandate

- **Living Document Policy**: `PROJECT_CONTEXT.md` is a living document and MUST be kept up to date.
- **Feature Completion Checklist**: Whenever a feature, route, component, server action, or database table is added, modified, or removed, the AI MUST update `PROJECT_CONTEXT.md`.
