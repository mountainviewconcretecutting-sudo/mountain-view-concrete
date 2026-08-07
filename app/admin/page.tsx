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
import ThemePanel from "@/components/admin/ThemePanel";
import ChangePasswordPanel from "@/components/admin/ChangePasswordPanel";
import { AlertTriangle } from "lucide-react";
import type { Lead, Project, Testimonial, Post, Comment, Service, Equipment } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Inline error banner shown in a dashboard section when its DB query fails. */
function SectionError({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
      <span>
        Unable to load <strong>{label}</strong> — please refresh the page or contact support if the
        problem persists.
      </span>
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
    themeSettings,
  ] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("testimonials").select("*, projects(title)").order("created_at", { ascending: false }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("*, posts(title, slug), projects(title)").order("created_at", { ascending: false }),
    supabase.from("services").select("*").order("display_order", { ascending: true }),
    supabase.from("equipment").select("*").order("display_order", { ascending: true }),
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

  return (
    <div className="bg-fog py-10">
      <div className="container-page">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl uppercase tracking-wide text-charcoal">Admin Dashboard</h1>
          <form action={adminLogout}>
            <button type="submit" className="btn-secondary">
              Sign Out
            </button>
          </form>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Admin Security &amp; Password
          </h2>
          <ChangePasswordPanel />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Site Theme
          </h2>
          <ThemePanel initialColors={themeSettings} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Quote Requests
          </h2>
          {leadsError ? (
            <SectionError label="Quote Requests" />
          ) : (
            <LeadsTable leads={(leads as Lead[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Service Catalogue Management
          </h2>
          {servicesError ? (
            <SectionError label="Service Catalogue" />
          ) : (
            <ServicesManager services={(services as Service[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Machinery &amp; Fleet Equipment
          </h2>
          {equipmentError ? (
            <SectionError label="Equipment" />
          ) : (
            <EquipmentManager equipment={(equipment as Equipment[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Comments Moderation (Posts &amp; Projects)
          </h2>
          {commentsError ? (
            <SectionError label="Comments" />
          ) : (
            <CommentsTable comments={(comments as Comment[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Testimonials Moderation
          </h2>
          {testimonialsError ? (
            <SectionError label="Testimonials" />
          ) : (
            <TestimonialsTable testimonials={(testimonials as Testimonial[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Featured Projects
          </h2>
          {projectsError ? (
            <SectionError label="Featured Projects" />
          ) : (
            <ProjectsManager projects={(projects as Project[]) ?? []} />
          )}
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
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

