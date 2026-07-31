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

