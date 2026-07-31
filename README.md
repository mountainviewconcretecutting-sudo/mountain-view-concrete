# Mountain View Concrete Cutting Inc. — Website

Full-stack marketing site + admin CMS built with **Next.js 15 (App Router)**,
**TypeScript**, **Tailwind CSS**, and **Supabase** (Postgres + Auth).

## Stack rationale

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Server Components for fast, SEO-friendly public pages; Server Actions remove the need for a separate API layer for the quote form and admin CRUD. |
| Styling | Tailwind CSS | Fast, consistent implementation of the token system in `tailwind.config.ts`. |
| Database + Auth | Supabase | Managed Postgres with Row Level Security — public read for projects, public insert (only) for leads, admin-only read/write, enforced at the database layer, not just in application code. |
| Email | Resend | Simple transactional email for new-lead notifications; optional — the app works without it configured. |
| Validation | Zod | Shared validation shape on both client and server action. |

## Project structure

```
mountain-view-concrete/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, Header/Footer/StickyCallBar
│   ├── page.tsx                 # Homepage (Hero, TrustBadges, Services, Projects, CTA)
│   ├── globals.css              # Design tokens usage, "cut" motif utilities
│   ├── about/page.tsx
│   ├── services/page.tsx        # Services with #cutting #core-drilling #demolition anchors
│   ├── projects/page.tsx        # Featured projects, filterable by category
│   ├── contact/page.tsx         # Contact info + inline quote form
│   └── admin/
│       ├── login/page.tsx       # Supabase Auth email/password login
│       └── page.tsx             # Dashboard: leads table + projects CMS
├── components/
│   ├── Header.tsx, Footer.tsx, StickyCallBar.tsx, QuoteModal.tsx
│   ├── home/                    # Hero, TrustBadges, SectorOverview, ServicesPreview,
│   │                             # FeaturedProjectsPreview, CtaBand
│   ├── admin/                   # LeadsTable, ProjectsManager (client components)
│   ├── contact/ContactFormSection.tsx
│   └── projects/ProjectsGrid.tsx
├── lib/
│   ├── types.ts                 # Shared domain types (mirrors supabase/schema.sql)
│   ├── supabase/
│   │   ├── server.ts             # Server Component / Server Action client + service-role client
│   │   └── client.ts             # Browser client (for future client-side reads)
│   └── actions/
│       ├── submitQuote.ts        # Public quote/contact form Server Action
│       └── admin.ts              # Admin login/logout, lead status update, project CRUD
├── middleware.ts                 # Protects /admin/*, redirects unauthenticated users to login
├── supabase/schema.sql            # Full DB schema, RLS policies, and seed data
├── tailwind.config.ts             # Color/type/motion design tokens
├── .env.example
└── DESIGN-NOTES.md                # Visual design rationale
```

## Database schema (see `supabase/schema.sql` for full DDL)

- **`projects`** — featured project / carousel content, editable from `/admin`.
  Public `select`; only authenticated admins can insert/update/delete.
- **`leads`** — quote & contact form submissions. Public `insert` only (no
  public `select`) — the browser can create a lead but never read the lead
  list; only admins or the service-role server key can.
- **`admin_profiles`** — marks which `auth.users` rows are staff. Supabase
  Auth handles password hashing/sessions; this table just gates `/admin`.

Enums: `service_type`, `project_category`, `lead_status`.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Resend keys
```

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.
2. Create your first admin user in Supabase Auth (Authentication → Users →
   Add user), then insert a matching row into `admin_profiles`:
   ```sql
   insert into admin_profiles (id, full_name)
   values ('<the-user-uuid>', 'Your Name');
   ```
3. Upload project photos to a Supabase Storage bucket (e.g. `project-photos`,
   set to public) and paste the public URLs into the admin Projects manager.
4. `npm run dev` — visit `/` for the site, `/admin/login` for the dashboard.

## Notes & next steps

- The contact form's honeypot field (`companyWebsite`) is a first line of
  defense against bots; add hCaptcha/Turnstile if spam becomes an issue.
- Resend is optional: if `RESEND_API_KEY` / `LEAD_NOTIFICATION_EMAIL` aren't
  set, leads still save to the database, they just skip the email ping.
- Image carousel on `/projects` currently renders a static grid with category
  filtering; swap in a carousel library (e.g. Embla) for the homepage preview
  if you want auto-rotating hero imagery later.
