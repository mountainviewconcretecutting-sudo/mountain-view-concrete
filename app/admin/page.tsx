import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminLogout } from "@/lib/actions/admin";
import { getThemeSettings } from "@/lib/actions/theme";
import LeadsTable from "@/components/admin/LeadsTable";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import PostsManager from "@/components/admin/PostsManager";
import CommentsTable from "@/components/admin/CommentsTable";
import ThemePanel from "@/components/admin/ThemePanel";
import type { Lead, Project, Testimonial, Post, Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { data: leads },
    { data: projects },
    { data: testimonials },
    { data: posts },
    { data: comments },
    themeSettings,
  ] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("testimonials").select("*, projects(title)").order("created_at", { ascending: false }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("*, posts(title, slug), projects(title)").order("created_at", { ascending: false }),
    getThemeSettings(),
  ]);

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
            Site Theme
          </h2>
          <ThemePanel initialColors={themeSettings} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Quote Requests
          </h2>
          <LeadsTable leads={(leads as Lead[]) ?? []} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Comments Moderation (Posts &amp; Projects)
          </h2>
          <CommentsTable comments={(comments as Comment[]) ?? []} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Testimonials Moderation
          </h2>
          <TestimonialsTable testimonials={(testimonials as Testimonial[]) ?? []} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Featured Projects
          </h2>
          <ProjectsManager projects={(projects as Project[]) ?? []} />
        </section>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg uppercase tracking-wide text-charcoal">
            Announcements &amp; News Posts
          </h2>
          <PostsManager posts={(posts as Post[]) ?? []} />
        </section>
      </div>
    </div>
  );
}

