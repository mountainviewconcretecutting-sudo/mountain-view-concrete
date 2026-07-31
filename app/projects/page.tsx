import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured Projects",
  description: "Recent residential, commercial, and industrial concrete cutting projects.",
};

async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Failed to load projects:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">Recent Work</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Featured Projects</h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page">
          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
