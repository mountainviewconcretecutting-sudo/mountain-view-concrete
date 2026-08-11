import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import TestimonialSectionWithForm from "@/components/projects/TestimonialSectionWithForm";
import { getAllProjects } from "@/lib/actions/projects";
import type { Project, Testimonial, Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured Projects — Calgary Concrete Cutting",
  description:
    "Browse completed residential, commercial, and industrial concrete cutting projects across Calgary and Western Alberta. Request a quote for your project today.",
};

async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*, projects(title)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load testimonials:", error.message);
      return [];
    }
    return (data as Testimonial[]) ?? [];
  } catch (err) {
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

async function getApprovedProjectComments(): Promise<Comment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .not("project_id", "is", null)
      .eq("status", "approved")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Failed to load project comments:", error.message);
      return [];
    }
    return (data as Comment[]) ?? [];
  } catch (err) {
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

export default async function ProjectsPage() {
  const [projects, testimonials, comments] = await Promise.all([
    getAllProjects(),
    getApprovedTestimonials(),
    getApprovedProjectComments(),
  ]);

  return (
    <>
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// RECENT WORK"}
          </span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            FEATURED PROJECTS
          </h1>
        </div>
      </section>

      <section className="bg-aggregate py-16 md:py-20 border-b-2 border-slurry/40">
        <div className="container-page">
          <ProjectsGrid projects={projects} comments={comments} />
        </div>
      </section>

      <TestimonialSectionWithForm projects={projects} testimonials={testimonials} />
    </>
  );
}
