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
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

export default async function FeaturedProjectsPreview() {
  const projects = await getFeaturedProjects();

  return (
    <section className="bg-aggregate py-16 md:py-24 border-b-2 border-slurry/40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
              {"// RECENT WORK"}
            </span>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
              FEATURED PROJECTS
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-widest text-flame hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
          >
            VIEW ALL PROJECTS <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 border-2 border-dashed border-slurry/50 bg-aggregate-deep py-16 text-center">
            <ImageOff size={36} className="text-steel" aria-hidden="true" />
            <p className="font-body text-sm text-steel-light">
              Project photos are coming soon. Check back shortly, or view our full service list.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slurry/30 border-b-2 border-slurry/40">
                  <ImageWithFallback
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block border border-flame/40 bg-flame/10 px-2 py-0.5 font-tech text-[10px] font-bold uppercase tracking-widest text-flame mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-chalk group-hover:text-flame transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-steel-light">{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
