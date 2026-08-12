import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminLogout } from "@/lib/actions/admin";
import { getThemeSettings } from "@/lib/actions/theme";
import LeadsTable from "@/components/admin/LeadsTable";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import PostsManager from "@/components/admin/PostsManager";
import CommentsTable from "@/components/admin/CommentsTable";
import ServicesManager from "@/components/admin/ServicesManager";
import EquipmentManager from "@/components/admin/EquipmentManager";
import GalleryManager from "@/components/admin/GalleryManager";
import ThemePanel from "@/components/admin/ThemePanel";
import ChangePasswordPanel from "@/components/admin/ChangePasswordPanel";
import { AlertTriangle } from "lucide-react";
import type { Lead, Project, Testimonial, Post, Comment, Service, Equipment, GalleryImage } from "@/lib/types";

export const dynamic = "force-dynamic";

const GALLERY_MIGRATION_SQL = `create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_order_idx on gallery_images(display_order);

alter table gallery_images enable row level security;

create policy "public can read gallery images"
  on gallery_images for select
  using (true);

create policy "admins can manage gallery images"
  on gallery_images for all
  using (is_admin())
  with check (is_admin());`;

/** Inline error banner shown in a dashboard section when its DB query fails. */
function SectionError({ label, sqlSnippet }: { label: string; sqlSnippet?: string }) {
  return (
    <div className="rounded-sm border border-red-400/60 bg-red-950/40 p-4 text-sm text-red-300 space-y-2">
      <div className="flex items-center gap-2 font-bold text-red-200">
        <AlertTriangle size={18} className="shrink-0 text-red-400" aria-hidden="true" />
        <span>Unable to load {label}</span>
      </div>
      <p className="font-body text-xs text-red-300/90 leading-relaxed">
        The database table for <strong className="text-chalk">{label}</strong> has not been created in Supabase yet.
      </p>
      {sqlSnippet && (
        <details className="mt-2 border border-red-500/30 bg-black/40 p-3 font-mono text-[11px] text-red-200">
          <summary className="cursor-pointer font-bold hover:text-white">View required Supabase SQL migration</summary>
          <pre className="mt-2 whitespace-pre-wrap text-emerald-400 select-all overflow-x-auto p-2 bg-black/60 rounded">
            {sqlSnippet}
          </pre>
        </details>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: leads, error: leadsError },
    { data: projects, error: projectsError },
    { data: testimonials, error: testimonialsError },
    { data: posts, error: postsError },
    { data: comments, error: commentsError },
    { data: services, error: servicesError },
    { data: equipment, error: equipmentError },
    { data: galleryImages, error: galleryError },
    themeSettings,
  ] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("testimonials").select("*, projects(title)").order("created_at", { ascending: false }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("*, posts(title, slug), projects(title)").order("created_at", { ascending: false }),
    supabase.from("services").select("*").order("display_order", { ascending: true }),
    supabase.from("equipment").select("*").order("display_order", { ascending: true }),
    supabase.from("gallery_images").select("*").order("display_order", { ascending: true }),
    getThemeSettings(),
  ]);

  // Log any query failures server-side so they appear in deployment logs.
  if (leadsError) console.error("[admin] leads query failed:", leadsError.message);
  if (projectsError) console.error("[admin] projects query failed:", projectsError.message);
  if (testimonialsError) console.error("[admin] testimonials query failed:", testimonialsError.message);
  if (postsError) console.error("[admin] posts query failed:", postsError.message);
  if (commentsError) console.error("[admin] comments query failed:", commentsError.message);
  if (servicesError) console.error("[admin] services query failed:", servicesError.message);
  if (equipmentError) console.error("[admin] equipment query failed:", equipmentError.message);
  if (galleryError) console.error("[admin] gallery_images query failed:", galleryError.message);

  return (
    <div className="bg-aggregate min-h-screen py-12 text-chalk border-b-4 border-slurry/40">
      <div className="container-page">
        <div className="flex items-center justify-between border-b-2 border-slurry/50 pb-6 mb-8">
          <div>
            <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
              {"// CONTROL PANEL"}
            </span>
            <h1 className="font-display text-4xl uppercase tracking-wider text-chalk font-bold">
              ADMIN DASHBOARD
            </h1>
          </div>
          <form action={adminLogout}>
            <button type="submit" className="btn-secondary !py-2.5 !px-5 text-sm">
              Sign Out
            </button>
          </form>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Admin Security &amp; Password
          </h2>
          <ChangePasswordPanel />
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Site Theme
          </h2>
          <ThemePanel initialColors={themeSettings} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Homepage Photo Gallery Carousel
          </h2>
          {galleryError ? (
            <SectionError label="Gallery Images" sqlSnippet={GALLERY_MIGRATION_SQL} />
          ) : (
            <GalleryManager images={(galleryImages as GalleryImage[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Quote Requests
          </h2>
          {leadsError ? (
            <SectionError label="Quote Requests" />
          ) : (
            <LeadsTable leads={(leads as Lead[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Services Catalog
          </h2>
          {servicesError ? (
            <SectionError label="Services" />
          ) : (
            <ServicesManager services={(services as Service[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Equipment Fleet Inventory
          </h2>
          {equipmentError ? (
            <SectionError label="Equipment" />
          ) : (
            <EquipmentManager equipment={(equipment as Equipment[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Blog Comments Moderation
          </h2>
          {commentsError ? (
            <SectionError label="Comments" />
          ) : (
            <CommentsTable comments={(comments as Comment[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Testimonials Moderation
          </h2>
          {testimonialsError ? (
            <SectionError label="Testimonials" />
          ) : (
            <TestimonialsTable testimonials={(testimonials as Testimonial[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Featured Projects
          </h2>
          {projectsError ? (
            <SectionError label="Featured Projects" />
          ) : (
            <ProjectsManager projects={(projects as Project[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wider text-chalk font-bold border-b border-slurry/40 pb-2">
            Announcements &amp; News Posts
          </h2>
          {postsError ? (
            <SectionError label="Posts" />
          ) : (
            <PostsManager posts={(posts as Post[]) ?? []} />
          )}
        </section>
      </div>
    </div>
  );
}
