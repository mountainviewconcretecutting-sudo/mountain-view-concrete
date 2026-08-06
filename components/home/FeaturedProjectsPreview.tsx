import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(3);

    if (error) {
      console.error("Failed to load featured projects:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    // Supabase env vars not configured yet in this environment — degrade
    // gracefully instead of crashing the homepage.
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

export default async function FeaturedProjectsPreview() {
  const projects = await getFeaturedProjects();

  return (
    <section className="bg-fog py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Recent Work</p>
            <h2 className="mt-2 text-3xl text-charcoal md:text-4xl">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 font-display text-sm uppercase tracking-wider text-orange"
          >
            View all projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-sm border border-dashed border-steel-light/50 bg-white py-16 text-center">
            <ImageOff size={32} className="text-steel-light" aria-hidden="true" />
            <p className="text-sm text-steel">
              Project photos are coming soon. Check back shortly, or view our full service list.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="group overflow-hidden rounded-sm bg-white shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-steel-light/20">
                  <ImageWithFallback
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-orange">
                    {project.category}
                  </span>
                  <h3 className="mt-1 text-lg text-charcoal">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
