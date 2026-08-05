-- ===========================================================================
-- Mountain View Concrete Cutting Inc. — Database schema (Supabase / Postgres)
-- Run via the Supabase SQL editor or `supabase db push`.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type service_type as enum (
  'wall_sawing',
  'slab_sawing',
  'core_drilling',
  'demolition_removal',
  'additional_property_services',
  'other'
);

create type project_category as enum ('residential', 'commercial', 'industrial');

create type lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');

create type testimonial_status as enum ('pending', 'approved', 'rejected');

create type comment_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- admin_profiles
-- One row per Supabase Auth user who is allowed into /admin. Auth itself is
-- handled by Supabase Auth (auth.users); this table just marks who's staff.
-- ---------------------------------------------------------------------------
create table admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects — Featured Projects / carousel, editable from the CMS
-- ---------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category project_category not null,
  service_type service_type not null,
  summary text not null,
  image_url text not null,
  location text,
  completed_on date,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_featured_idx on projects (is_featured, sort_order);
create index projects_category_idx on projects (category);

-- ---------------------------------------------------------------------------
-- leads — Quote / contact form submissions
-- ---------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  service_type service_type not null,
  project_description text not null,
  preferred_date date,
  status lead_status not null default 'new',
  created_at timestamptz not null default now(),

  constraint leads_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint leads_phone_len check (char_length(phone) between 7 and 20)
);

create index leads_status_idx on leads (status, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger for projects
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at
before update on projects
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Helper Function: is_admin()
-- Checks if the calling user exists in `admin_profiles`.
-- Uses SECURITY DEFINER to bypass RLS recursion on `admin_profiles`.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admin_profiles
    where id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table admin_profiles enable row level security;
alter table projects enable row level security;
alter table leads enable row level security;

-- Anyone (anon) can read projects — it's public marketing content.
create policy "projects are publicly readable"
  on projects for select
  using (true);

-- Only authenticated admins can write projects.
create policy "admins can manage projects"
  on projects for all
  using (is_admin())
  with check (is_admin());

-- Anyone can INSERT a lead (the public quote form), but nobody can read/list
-- leads from the client — only the server (service-role key) or an admin can.
create policy "anyone can submit a lead"
  on leads for insert
  with check (true);

create policy "admins can view leads"
  on leads for select
  using (is_admin());

create policy "admins can update leads"
  on leads for update
  using (is_admin())
  with check (is_admin());

-- admin_profiles: admins can see the staff list; nobody can self-promote.
create policy "admins can view admin list"
  on admin_profiles for select
  using (is_admin());

-- ---------------------------------------------------------------------------
-- site_content — Editable text content sections across the site
-- ---------------------------------------------------------------------------
create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "site_content is publicly readable"
  on site_content for select
  using (true);

create policy "admins can update site_content"
  on site_content for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------------------------
-- testimonials — Customer reviews and testimonials (public submit, admin moderate)
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  message text not null,
  project_id uuid references projects (id) on delete set null,
  status testimonial_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists testimonials_status_idx on testimonials (status, created_at desc);

alter table testimonials enable row level security;

-- Anyone can submit a pending testimonial
create policy "anyone can submit a testimonial"
  on testimonials for insert
  with check (status = 'pending');

-- Public can read approved testimonials
create policy "approved testimonials are publicly readable"
  on testimonials for select
  using (status = 'approved');

-- Admins can manage testimonials
create policy "admins can manage testimonials"
  on testimonials for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------------------------
-- posts — Company announcements, news, and updates (admin-managed)
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,
  cover_image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on posts (is_published, created_at desc);

alter table posts enable row level security;

-- Public can read only published posts
create policy "public can read published posts"
  on posts for select
  using (is_published = true);

-- Admins can do everything
create policy "admins can manage posts"
  on posts for all
  using (is_admin())
  with check (is_admin());

-- Reuse the shared set_updated_at() trigger function for posts
create trigger posts_set_updated_at
before update on posts
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- comments — User comments on posts and projects (public submit, admin moderate)
-- ---------------------------------------------------------------------------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts (id) on delete cascade,
  project_id uuid references projects (id) on delete cascade,
  author_name text not null,
  message text not null,
  status comment_status not null default 'pending',
  created_at timestamptz not null default now(),

  constraint check_comment_target check (
    (post_id is not null and project_id is null) or
    (post_id is null and project_id is not null)
  )
);

create index if not exists comments_post_idx on comments (post_id, status, created_at desc);
create index if not exists comments_project_idx on comments (project_id, status, created_at desc);

alter table comments enable row level security;

-- Anyone can submit a pending comment
create policy "anyone can submit a comment"
  on comments for insert
  with check (status = 'pending');

-- Public can read approved comments
create policy "approved comments are publicly readable"
  on comments for select
  using (status = 'approved');

-- Admins can manage comments
create policy "admins can manage comments"
  on comments for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------------------------
-- Seed data: starting service catalogue projects & site content
-- ---------------------------------------------------------------------------
insert into projects (title, category, service_type, summary, image_url, location, is_featured, sort_order)
values
  ('Downtown Office Core Drilling', 'commercial', 'core_drilling',
   'Precision 18" core penetrations for new mechanical risers in a 12-storey office tower.',
   '/images/projects/office-core-drilling.jpg', 'Downtown Calgary', true, 1),
  ('Residential Basement Slab Cut', 'residential', 'slab_sawing',
   'Clean slab sawing for a new sump pit and drainage retrofit.',
   '/images/projects/residential-slab.jpg', 'Signal Hill, Calgary', true, 2),
  ('Industrial Wall Opening', 'industrial', 'wall_sawing',
   'Structural wall sawing to create a new loading bay opening in a reinforced tilt-up wall.',
   '/images/projects/industrial-wall-saw.jpg', 'Foothills Industrial, Calgary', true, 3);

insert into site_content (key, value)
values
  ('hero_tagline', 'Precision Cutting.\nSolid Results.'),
  ('hero_subtext', 'Concrete cutting, core drilling, and demolition for residential, commercial, and industrial projects across Calgary and Western Alberta — backed by state-of-the-art equipment and 25+ years of hands-on experience.'),
  ('about_story', 'Mountain View Concrete Cutting Inc. (2549952 Alberta Inc.) was established more than 25 years ago in Western Alberta. What started as a small crew with a handful of saws has grown into a trusted contractor serving residential, commercial, and industrial clients across Calgary and the surrounding region.\n\nWe''ve built our reputation the same way for two and a half decades: showing up on time, cutting it right the first time, and communicating clearly from quote to cleanup.'),
  ('about_mission', 'To deliver safe, precise, and dependable concrete cutting, drilling, and removal services using state-of-the-art equipment and proven techniques — so every job is completed efficiently and to the highest industry standard.')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- services — Catalogue of services offered (admin-manageable)
-- ---------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  spec_list text[],
  icon_name text,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_display_order_idx on services (display_order);

alter table services enable row level security;

create policy "services are publicly readable"
  on services for select
  using (true);

create policy "admins can manage services"
  on services for all
  using (is_admin())
  with check (is_admin());

create trigger services_set_updated_at
before update on services
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- equipment — Fleet and machinery inventory (admin-manageable)
-- ---------------------------------------------------------------------------
create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  specs text[],
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_display_order_idx on equipment (display_order);

alter table equipment enable row level security;

create policy "equipment is publicly readable"
  on equipment for select
  using (true);

create policy "admins can manage equipment"
  on equipment for all
  using (is_admin())
  with check (is_admin());

create trigger equipment_set_updated_at
before update on equipment
for each row execute function set_updated_at();

-- Seed initial services
insert into services (title, slug, description, spec_list, icon_name, display_order)
values
  ('Wall Sawing', 'wall-sawing',
   'Precision cutting through reinforced concrete walls for new openings, doorways, and mechanical penetrations — indoors or out, on active job sites.',
   array['Up to 24" depth', 'Flush cutting capable', 'Track-mounted electric/hydraulic saws'], 'Scissors', 1),
  ('Slab Sawing', 'slab-sawing',
   'High-capacity floor and flat slab sawing for retrofits, utility trenches, and structural modifications, with clean, accurate cut lines.',
   array['Electric & diesel flat saws', 'Control joint sawing', 'Trenching up to 18" depth'], 'Scissors', 2),
  ('Core Drilling', 'core-drilling',
   'Precision core drilling capabilities up to 22 inches in diameter, for conduit runs, plumbing penetrations, anchor bolts, and structural inspections.',
   array['Up to 22" diameter', 'Any angle / ceiling mounting', 'Electric & hydraulic rigs'], 'CircleDot', 3),
  ('Demolition & Removal', 'demolition-removal',
   'Safe concrete demolition and jackhammering, Bobcat and mini-excavator operation, and full haul-away disposal — left clean and job-site ready.',
   array['Selective structural demolition', 'Robotic/hydraulic hammering', 'Full site cleanup & disposal'], 'HardHat', 4),
  ('Additional Property Services', 'property-services',
   'Beyond concrete, our crew handles a range of property maintenance and installation work for the same commercial and residential clients we cut for.',
   array['Parking lot line painting', 'Wall painting', 'Furnace & AC maintenance', 'Roof maintenance', 'Snow removal', 'Topsoil supply & turf installation', 'Bollard installation', 'Mobile welding services', 'Security camera installation', 'Detector loop installation'], 'Wrench', 5)
on conflict (slug) do nothing;

-- Seed initial equipment
insert into equipment (name, description, specs, display_order)
values
  ('Mini excavator (Mini Ho)', 'Compact excavator for tight-access interior and exterior excavation and concrete removal.', array['Rubber tracks', 'Hydraulic breaker attachment', 'Zero tail-swing'], 1),
  ('Bobcat Skid-Steer', 'High-capacity loader for efficient debris removal, gravel placement, and site grading.', array['Heavy duty bucket', 'High-flow hydraulics', 'Enclosed cab'], 2),
  ('Dump trailer', 'Heavy-duty dump trailer for fast material haul-away and concrete slab disposal.', array['14,000 lbs GVWR', 'Hydraulic lift dump', 'Tarp cover system'], 3),
  ('22-inch capacity core drills', 'Heavy-duty electric and hydraulic core drill rigs capable of penetrating heavily reinforced concrete up to 22" diameter.', array['22" diameter capacity', 'Vacuum-base and anchor-base mounts', 'Multi-speed gearboxes'], 4)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- theme_settings — Brand color tokens editable from the admin dashboard.
-- Values are stored as 6-digit hex strings (#rrggbb).
-- The root layout reads these, converts to RGB channels, and injects CSS
-- custom properties (--color-orange, --color-charcoal, etc.) so every
-- Tailwind color token resolves through the variable at runtime.
-- ---------------------------------------------------------------------------
create table if not exists theme_settings (
  key text primary key,
  value text not null check (value ~ '^#[0-9a-fA-F]{6}$'),
  updated_at timestamptz not null default now()
);

alter table theme_settings enable row level security;

-- Anyone can read theme settings (they're just color values, not sensitive)
create policy "theme_settings are publicly readable"
  on theme_settings for select
  using (true);

-- Only admins can update the theme
create policy "admins can manage theme_settings"
  on theme_settings for all
  using (is_admin())
  with check (is_admin());

-- Seed the 6 brand color defaults.
-- If no rows exist, getThemeSettings() falls back to these same values in
-- code, so the site looks identical with or without the seed having run.
insert into theme_settings (key, value)
values
  ('color_orange',        '#E85D04'),
  ('color_orange_hover',  '#C94E02'),
  ('color_orange_soft',   '#FDECDF'),
  ('color_charcoal',      '#1E2022'),
  ('color_charcoal_soft', '#2A2D30'),
  ('color_charcoal_hard', '#141516')
on conflict (key) do nothing;
