# PROJECT_CONTEXT.md — Mountain View Concrete Cutting Inc.

> **Project Architecture & Context Document**  
> *Last Updated: July 2026*

---

## 1. Project Overview & Business Context

### Brief Summary
**Mountain View Concrete Cutting Inc.** (2549952 Alberta Inc.) is a full-stack marketing website and custom lightweight Content Management System (CMS) built for a commercial and residential concrete cutting contractor operating in Calgary and Western Alberta with 25+ years of industry experience.

### Core Purpose & Value Proposition
The primary objective of the site is to drive qualified quote requests, showcase 25+ years of structural concrete cutting, slab sawing, wall sawing, core drilling, and demolition expertise, and establish a high-trust digital presence with 24/7 emergency response branding.

### Key Features & Capabilities
- **Public Marketing Website**: High-performance, SEO-optimized public pages (`/`, `/about`, `/services`, `/projects`, `/contact`) with a custom industrial slate & safety orange design system featuring dynamic diagonal saw-blade cut motifs (`clip-path`).
- **Inline Site Content Editing System**: Allows authenticated staff to edit core site text (e.g. hero tagline, subtext, company story, mission statement) directly on live public pages using inline rich-text controls without navigating to a separate CMS dashboard.
- **Quote Lead Capture**: Interactive modal and dedicated contact section with bot-honeypot protection, Zod input validation, database storage, and automated transactional email alerts via Resend.
- **Testimonial Submission & Moderation**: Public-facing customer feedback form with admin approval workflow before reviews publish to the live homepage/projects pages.
- **Admin CMS Dashboard (`/admin`)**: Protected management portal for reviewing quote leads, moderating testimonials, and performing full CRUD operations on featured project portfolios.

---

## 2. Tech Stack & Dependencies

### Core Technical Architecture

| Layer | Technology | Version | Purpose & Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `15.1.0` | React Server Components for SEO, page load speed, and Server Actions for unified backend logic without API routes. |
| **Language** | TypeScript | `^5.6.3` | Strict type safety across client components, server actions, and database models. |
| **Styling** | Tailwind CSS | `^3.4.14` | Utility-first CSS using custom token mappings in `tailwind.config.ts` and custom saw-cut clip-path utilities. |
| **Database & Auth** | Supabase (Postgres) | `@supabase/supabase-js` `^2.45.4`<br>`@supabase/ssr` `^0.5.2` | Managed Postgres database with Row Level Security (RLS), Supabase Auth session handling, and server-role client overrides. |
| **Form Validation** | Zod | `^3.23.8` | Shared validation schemas for quote forms, testimonials, and project management. |
| **Icons** | Lucide React | `^0.454.0` | Lightweight SVG icons (`Pencil`, `CheckCircle2`, `Loader2`, `ImageOff`, etc.). |
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
    │   ├── layout.tsx                  # Root layout: Fonts, EditModeProvider, Header, Footer, StickyCallBar
    │   ├── page.tsx                    # Homepage: Hero, TrustBadges, SectorOverview, Services, Projects, Testimonials, CTA
    │   ├── globals.css                 # Custom font imports & cut-above/cut-below clip-path rules
    │   ├── not-found.tsx               # Custom 404 page
    │   ├── about/                      # About Us page with editable company story and mission
    │   │   └── page.tsx
    │   ├── services/                   # Detailed service catalog with anchor links (#wall-sawing, #slab-sawing, etc.)
    │   │   └── page.tsx
    │   ├── projects/                   # Portfolio showcase filterable by category (residential, commercial, industrial)
    │   │   └── page.tsx
    │   ├── contact/                    # Contact information & inline quote submission form
    │   │   └── page.tsx
    │   └── admin/                      # Protected Admin CMS Area
    │       ├── login/                  # Supabase Auth email/password login portal
    │       │   └── page.tsx
    │       └── page.tsx                # Admin Dashboard (Leads Table, Testimonial Moderation, Projects Manager)
    │
    ├── components/                     # Reusable React UI Components
    │   ├── Header.tsx                  # Desktop/mobile navigation & request quote button
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
    │   │   ├── LeadsTable.tsx
    │   │   ├── ProjectsManager.tsx
    │   │   └── TestimonialsTable.tsx
    │   ├── contact/
    │   │   └── ContactFormSection.tsx
    │   └── projects/
    │       └── ProjectsGrid.tsx
    │
    ├── lib/                            # Application Logic, Database Clients, & Server Actions
    │   ├── types.ts                    # Shared domain TypeScript types (Lead, Project, Testimonial, SiteContent)
    │   ├── supabase/
    │   │   ├── server.ts               # SSR Supabase client (cookie-aware) & service-role client
    │   │   └── client.ts               # Browser Supabase client
    │   └── actions/                    # Server Actions (Mutations & Privileged Queries)
    │       ├── admin.ts                # Login, logout, lead status updates, testimonial moderation, project CRUD
    │       ├── siteContent.ts          # getIsAdmin, getSiteContent, getSiteContents, updateSiteContent
    │       ├── submitQuote.ts          # Public lead form handler with Zod validation & Resend email trigger
    │       └── submitTestimonial.ts    # Public testimonial submission handler
    │
    ├── middleware.ts                   # Auth middleware protecting /admin/* and handling login redirects
    ├── scripts/
    │   └── create-admin.mjs            # CLI script to provision/update admin credentials in Supabase Auth & admin_profiles
    ├── supabase/
    │   └── schema.sql                  # Database DDL, Enum types, RLS policies, helper functions, seed data
    ├── public/                         # Static web assets (favicon, images, project photos)
    └── tailwind.config.ts              # Color palette, font variables, and custom theme tokens
```

---

## 4. Key Features & Design Patterns

### A. Inline Site Content Editing System
The application features a zero-friction, on-page content editing workflow built with React Server Components, Context, and Server Actions:

```
[ RootLayout ] ──> calls getIsAdmin() ──> passes isAdmin to <EditModeProvider>
                                                      │
             ┌────────────────────────────────────────┴────────────────────────────────────────┐
             ▼                                                                                 ▼
     [ Visitor (isAdmin=false) ]                                                      [ Admin (isAdmin=true) ]
     Renders plain text directly                                                     Renders <EditModeToggle>
     Zero client JS editing overhead                                                 Enables <EditableText> components
                                                                                               │
                                                                                               ▼
                                                                                   Click text to edit inline
                                                                                   Calls updateSiteContent(key, val)
                                                                                   Revalidates path layout
```

- **`EditModeContext.tsx`**: Wraps the entire application. When a user is not an authenticated admin (`isAdmin=false`), it renders children without adding event listeners or edit UI. When `isAdmin=true`, it tracks `isEditMode` state and mounts `EditModeToggle`.
- **`EditModeToggle.tsx`**: Floating button pinned to the screen corner (`fixed bottom-20 right-4`). Toggles page editing mode ON/OFF with visual status indicators.
- **`EditableText.tsx`**: Wraps dynamic site keys (e.g. `hero_tagline`, `hero_subtext`, `about_story`, `about_mission`).
  - When edit mode is active, hovering over text highlights it with a dashed orange border and "Edit" badge.
  - Clicking triggers an inline rich textarea with `Ctrl+Enter` save shortcuts.
  - On submit, it calls the `updateSiteContent` Server Action.
- **`lib/actions/siteContent.ts`**:
  - `getIsAdmin()`: Checks Supabase Auth session and verifies existence in `admin_profiles`.
  - `getSiteContents(keys, defaults)`: Batch queries the `site_content` table; falls back gracefully to hardcoded default text if database rows are missing or uninitialized.
  - `updateSiteContent(key, value)`: Verifies admin auth, upserts into `site_content`, and calls `revalidatePath('/', 'layout')` to instantly update cache across all routes.

### B. Authentication & Admin Flow
- **Supabase Auth Integration**: User authentication uses standard Supabase email/password auth (`auth.users`).
- **Staff Verification**: Access to administrative capabilities is gated by the `admin_profiles` table in Postgres, checked via the `is_admin()` SQL security-definer function.
- **Next.js Middleware (`middleware.ts`)**:
  - Protects all `/admin/*` sub-routes (excluding `/admin/login`). Unauthenticated users are redirected to `/admin/login?redirectTo=...`.
  - Authenticated users attempting to visit `/admin/login` are redirected straight to `/admin`.
- **Admin User Provisioning Script (`scripts/create-admin.mjs`)**:
  - CLI script executed via `npm run create-admin <email> <password> [fullName]`.
  - Reads `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS, checks if the user exists in Supabase Auth, creates/updates credentials, and automatically creates the corresponding `admin_profiles` database record.

### C. Data Fetching & Resilience Strategy
- **Fail-Safe Server Rendering**: Public pages (`app/page.tsx`, `app/about/page.tsx`) wrap database content calls in fallback mechanisms. If Supabase environment variables are missing or database connection fails, default text constants are returned so the public site never throws 500 errors.
- **Row Level Security (RLS)**:
  - `projects`: Publicly readable (`select true`), writable only by admins (`is_admin()`).
  - `leads`: Publicly insertable (`insert true`), read/update restricted exclusively to admins (`is_admin()`). Browser clients cannot read other leads.
  - `site_content`: Publicly readable (`select true`), updateable only by admins (`is_admin()`).
  - `testimonials`: Anyone can submit with status `pending`. Only `approved` rows are publicly readable. Admins can read, approve, or reject.

---

## 5. Strict AI Rules & Safety Guardrails

When modifying or extending this codebase, future AI assistants MUST adhere strictly to the following safety rules:

1. **NO Codebase Refactoring or Code Modification Without Explicit Instruction**:
   - Do NOT rewrite or alter existing working features, page routes (`/`, `/about`, `/services`, `/projects`, `/contact`, `/admin`), or layout structures unless explicitly requested by the user.

2. **Maintain Strict TypeScript Compliance**:
   - Always define explicit types or use domain models from `lib/types.ts`.
   - Do NOT insert `any` types or disable TypeScript strict checks.

3. **Asset & Path Verification**:
   - Before referencing local image files (e.g. `/images/projects/...`), verify their existence in `public/`.
   - Component logic must gracefully handle missing image URLs (e.g., displaying SVG placeholders like `ImageOff` in `FeaturedProjectsPreview.tsx`) to prevent broken 404 image renderings.

4. **Security & Environment Key Safeguards**:
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or browser bundles (`"use client"` files). It must remain strictly in server actions, server components, or administrative CLI scripts.
   - Always retain RLS authorization checks (`getIsAdmin()`) in server actions that perform database updates or deletes.

5. **Server Component vs Client Component Boundaries**:
   - Keep `"use client"` directives focused at the smallest interactive component boundary (`EditableText`, `EditModeToggle`, form handlers).
   - Do NOT turn top-level page components (`app/page.tsx`, `app/about/page.tsx`) into client components; maintain Server Component rendering for SEO and performance.

---

## 6. Environment & Setup Checklist

### Required Environment Variables (`.env.local`)
Create `.env.local` in the project directory with the following configuration:

```env
# Supabase Settings (Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email Configuration (Optional - resend.com)
RESEND_API_KEY=re_your_resend_api_key
LEAD_NOTIFICATION_EMAIL=crafuse0@gmail.com
```

### Setup Steps
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Database Initialization**:
   - Execute the SQL script in `supabase/schema.sql` inside your Supabase project's SQL Editor. This sets up tables (`projects`, `leads`, `admin_profiles`, `site_content`, `testimonials`), RLS policies, enums, triggers, and seed data.
3. **Provision Initial Admin Account**:
   ```bash
   npm run create-admin admin@mountainviewconcrete.ca MySecurePassword123! "Admin User"
   ```
4. **Development Server**:
   ```bash
   npm run dev
   ```
   - Main website: `http://localhost:3000`
   - Admin portal: `http://localhost:3000/admin`

5. **Production Build Validation**:
   ```bash
   npm run build
   ```
