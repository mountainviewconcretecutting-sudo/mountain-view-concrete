# Mountain View Concrete Cutting Inc. — Website

Full-stack marketing site and custom lightweight CMS built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (Postgres + Auth + Storage).

---

## Tech stack

| Concern | Choice | Version | Why |
|---|---|---|---|
| Framework | Next.js App Router | `^15.1.0` | React Server Components for SEO-optimised public pages; Server Actions replace a separate API layer for forms, CRUD, and admin mutations. |
| Language | TypeScript | `^5.6.3` | Strict typing across client components, server actions, and DB models. |
| Styling | Tailwind CSS | `^3.4.14` | Utility-first CSS with a custom "Mountain View Industrial UI" design system: safety-orange / deep-charcoal palette, hard box-shadows, clip-path cut motifs, and six brand color tokens backed by runtime CSS custom properties. |
| Database + Auth | Supabase (Postgres + Auth + Storage) | `@supabase/supabase-js ^2.45.4` / `@supabase/ssr ^0.5.2` | Managed Postgres with Row Level Security enforced at the DB layer; Supabase Auth for admin sessions; Supabase Storage (`site-images` bucket) for admin image uploads. |
| Email | Resend | `^4.0.1` | Transactional email notifications on new quote/lead submissions. Optional — the app works without it. |
| Validation | Zod | `^3.23.8` | Shared schema validation for quote forms, testimonials, comments, services, equipment, and posts. |
| Icons | Lucide React | `^0.454.0` | Lightweight SVG icon set used throughout the UI. |
| Utilities | clsx | `^2.1.1` | Conditional class joining for UI state handling. |

---

## Project structure

```
mountain-view-concrete/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, JSON-LD schema, EditModeProvider, Header/Footer/StickyCallBar
│   ├── page.tsx                    # Homepage: Hero, TrustBadges, SectorOverview, ServicesPreview, FeaturedProjectsPreview, TestimonialsSection, CtaBand
│   ├── globals.css                 # cut-above / cut-below clip-path utilities
│   ├── sitemap.ts                  # Dynamic XML sitemap (static routes + published /updates/[slug])
│   ├── robots.ts                   # Crawler rules (disallows /admin/, /api/)
│   ├── not-found.tsx               # Styled 404 page
│   ├── about/page.tsx              # About Us — editable company story & mission via EditableText
│   ├── services/page.tsx           # Service catalogue (#cutting, #core-drilling, #demolition, #equipment, #property-services anchors)
│   ├── projects/page.tsx           # Filterable project portfolio + testimonials section
│   ├── updates/
│   │   ├── page.tsx                # Announcements listing (ISR revalidate=60)
│   │   └── [slug]/page.tsx         # Post detail with generateMetadata(), comments
│   ├── contact/page.tsx            # Contact info + service coverage area + inline quote form
│   ├── privacy/page.tsx            # Privacy Policy (PIPA / Alberta compliance)
│   ├── terms/page.tsx              # Terms of Service
│   └── admin/
│       ├── login/page.tsx          # Supabase Auth email/password login
│       └── page.tsx                # Admin dashboard (tabbed: Leads, Comments, Testimonials, Services, Equipment, Projects, Posts, Theme)
│
├── components/
│   ├── Header.tsx                  # Sticky desktop/mobile nav with quote modal trigger
│   ├── Footer.tsx                  # Site footer with service anchor links, contact details, legal links
│   ├── StickyCallBar.tsx           # Mobile persistent emergency call + quote bar
│   ├── QuoteModal.tsx              # Overlay quote form modal
│   ├── ImageWithFallback.tsx       # next/image wrapper with ImageOff fallback on error
│   ├── edit-mode/
│   │   ├── EditModeContext.tsx     # Context: isAdmin state + edit-mode toggle
│   │   ├── EditModeToggle.tsx      # Floating button to enter/exit inline edit mode
│   │   └── EditableText.tsx        # Inline-editable text with server action save + revalidatePath
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── SectorOverview.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── FeaturedProjectsPreview.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CtaBand.tsx
│   ├── admin/
│   │   ├── LeadsTable.tsx          # Lead management + status updates
│   │   ├── ProjectsManager.tsx     # Project CRUD with ImageDropzone
│   │   ├── PostsManager.tsx        # Posts CRUD: publish toggle, auto-slug, ImageDropzone
│   │   ├── TestimonialsTable.tsx   # Testimonial approval/rejection
│   │   ├── CommentsTable.tsx       # Unified post + project comment moderation
│   │   ├── ServicesManager.tsx     # Service catalogue CRUD
│   │   ├── EquipmentManager.tsx    # Equipment/fleet CRUD
│   │   ├── ThemePanel.tsx          # Live brand color customiser
│   │   ├── ImageDropzone.tsx       # Drag-and-drop uploader to Supabase Storage (site-images bucket)
│   │   └── ChangePasswordPanel.tsx # Admin self-service password change
│   ├── comments/
│   │   └── CommentsSection.tsx     # Public comment list + submission form (honeypot protected)
│   ├── contact/
│   │   └── ContactFormSection.tsx  # Quote lead form (Zod-validated, Resend email, honeypot)
│   └── projects/
│       ├── ProjectsGrid.tsx        # Filterable project grid
│       └── TestimonialSectionWithForm.tsx
│
├── lib/
│   ├── types.ts                    # Shared domain types: Lead, Project, Testimonial, Post, Comment, Service, Equipment, SiteContent
│   ├── utils/
│   │   ├── slugify.ts              # Slug generator for posts
│   │   └── colors.ts               # hexToRgbChannels() for runtime CSS custom properties
│   ├── supabase/
│   │   ├── server.ts               # Cookie-aware SSR client + service-role client
│   │   └── client.ts               # Browser client (used by client components)
│   └── actions/
│       ├── admin.ts                # All admin mutations: leads, projects, posts, services, equipment, testimonials, comments
│       ├── services.ts             # getServices() / getEquipment() with fallback defaults
│       ├── siteContent.ts          # getIsAdmin(), getSiteContents(), updateSiteContent()
│       ├── submitComment.ts        # Public comment submission (Zod, honeypot, service-role retry guard)
│       ├── submitQuote.ts          # Public quote/lead submission (Zod, DB insert, Resend email)
│       └── submitTestimonial.ts    # Public testimonial submission
│
├── middleware.ts                   # Protects /admin/* (redirects unauthenticated to /admin/login)
├── scripts/
│   └── create-admin.mjs            # CLI script: provisions or updates admin credentials in Supabase Auth + admin_profiles
├── supabase/
│   └── schema.sql                  # Complete DDL: 10 tables, 5 enum types, RLS policies, is_admin() function, seed data, storage bucket
├── public/
│   ├── favicon.ico
│   └── images/                     # Static images: hero/, services/, projects/, equipment/
├── next.config.mjs
├── tailwind.config.ts              # Color palette, font variables, custom brand tokens
└── .env.example
```

---

## Database schema

All tables live in a single Supabase Postgres project. Run `supabase/schema.sql` in the SQL editor to create everything from scratch, including RLS policies, indexes, the `is_admin()` helper function, seed data, and the Storage bucket.

### Enum types
| Enum | Values |
|---|---|
| `service_type` | `wall_sawing`, `slab_sawing`, `core_drilling`, `demolition_removal`, `additional_property_services`, `other` |
| `project_category` | `residential`, `commercial`, `industrial` |
| `lead_status` | `new`, `contacted`, `quoted`, `won`, `lost` |
| `testimonial_status` | `pending`, `approved`, `rejected` |
| `comment_status` | `pending`, `approved`, `rejected` |

### Tables

| Table | Purpose | Public access |
|---|---|---|
| `admin_profiles` | Marks which `auth.users` rows are staff. One row per admin; gates `/admin` and all privileged operations via `is_admin()`. | No public access |
| `projects` | Featured portfolio entries with title, category, service type, summary, image URL, location, and featured/sort flags. | Public `SELECT` |
| `leads` | Quote and contact form submissions (name, phone, email, service type, description, preferred date, status). | Public `INSERT` only — no public `SELECT` |
| `site_content` | Key/value store for editable site copy (hero tagline, hero subtext, about story, about mission, etc.). | Public `SELECT` |
| `testimonials` | Customer reviews with rating (1–5), message, optional project reference, and moderation status. | Public `INSERT` (pending); public `SELECT` of approved rows |
| `posts` | Company announcements and news: title, unique slug, body, optional cover image, publish status. | Public `SELECT` of published rows |
| `comments` | User comments attached to a `post_id` OR `project_id` (enforced by constraint), with moderation status. | Public `INSERT` (pending); public `SELECT` of approved rows |
| `services` | Service catalogue entries: title, slug, description, spec list (array), icon name, image URL, display order. | Public `SELECT` |
| `equipment` | Machinery/fleet inventory: name, description, specs (array), image URL, display order. | Public `SELECT` |
| `theme_settings` | Brand color tokens stored as 6-digit hex strings (`color_orange`, `color_charcoal`, etc.), injected as runtime CSS custom properties. | Public `SELECT` |

### Storage
| Bucket | Access |
|---|---|
| `site-images` | Public `SELECT`; admin-only `INSERT` / `DELETE` via `is_admin()` |

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in all values.

```env
# Supabase — Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only — never expose to the browser

# Resend — transactional email for new-lead notifications (resend.com)
# All three are optional; if unset, leads save to the DB but no email is sent.
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL="Mountain View Concrete Cutting <onboarding@resend.dev>"  # defaults to Resend sandbox sender
LEAD_NOTIFICATION_EMAIL=mountainviewconcretecutting@gmail.com
MOUNTAIN_VIEW_TARGET_EMAIL=mountainviewconcretecutting@gmail.com
```

> **`RESEND_FROM_EMAIL`** — if omitted, `submitQuote.ts` falls back to `"Mountain View Concrete Cutting <onboarding@resend.dev>"` (Resend sandbox). Set this to a verified domain sender for production.

---

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Resend keys
```

1. **Create a Supabase project**, then run `supabase/schema.sql` in the SQL editor.  
   This creates all 10 tables, enums, RLS policies, the `is_admin()` helper function, seed data (3 sample projects, 5 services, 4 equipment items, site copy, 6 brand color defaults), and the `site-images` Storage bucket with its access policies — all in one shot.

2. **Provision the first admin account** using the CLI script:
   ```bash
   npm run create-admin admin@example.com YourPassword123! "Your Name"
   ```
   The script creates (or updates) the Supabase Auth user and upserts the matching `admin_profiles` row. Requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to be set in `.env.local`.

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin/login`

---

## Admin dashboard

The `/admin` dashboard is protected by Next.js middleware and requires a valid Supabase Auth session with a matching `admin_profiles` row. It exposes eight management panels:

| Panel | What it manages |
|---|---|
| **Leads** | View and update status of quote/contact form submissions |
| **Comments** | Unified moderation queue for post and project comments |
| **Testimonials** | Approve or reject customer review submissions |
| **Services** | Add, edit, and reorder service catalogue entries |
| **Equipment** | Add, edit, and reorder equipment/fleet inventory |
| **Projects** | Full project portfolio CRUD with image upload |
| **Posts** | Company announcements CRUD with slug generation, publish toggle, and image upload |
| **Theme** | Live brand color customisation (updates CSS custom properties at runtime) |

Admins can also toggle **Inline Edit Mode** on any public page to edit site copy (hero tagline, about story, mission, etc.) directly in-place without visiting the dashboard.

---

## Key scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Compile a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run create-admin <email> <password> [name]` | Provision or update an admin account in Supabase |

---

## Notes

- **Resend is optional.** If `RESEND_API_KEY` / `LEAD_NOTIFICATION_EMAIL` are not set, leads are saved to the database and the email step is silently skipped.
- **Honeypot bot protection** is present on the quote form (`companyWebsite` field) and on the comment/testimonial forms. Add hCaptcha or Cloudflare Turnstile if spam becomes a concern.
- **Image uploads** go directly to the Supabase Storage `site-images` bucket via the `ImageDropzone` component. The bucket is created automatically when you run `schema.sql`. No separate bucket setup step is required.
- **Theme colors** are stored in the `theme_settings` table as hex values. The root layout reads them on every server render, converts to RGB channels via `hexToRgbChannels()`, and injects them as CSS custom properties so all Tailwind color tokens resolve correctly without a build step.
- **ISR on `/updates`** — the announcements listing page revalidates every 60 seconds (`revalidate = 60`) so new posts appear without a full redeploy.
