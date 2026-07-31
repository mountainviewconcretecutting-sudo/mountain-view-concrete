"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Project, ProjectCategory } from "@/lib/types";

const FILTERS: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === value
                ? "border-orange bg-orange text-white"
                : "border-steel-light/50 bg-white text-charcoal hover:border-orange"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-sm border border-dashed border-steel-light/50 bg-white p-10 text-center text-sm text-steel">
          No projects in this category yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-sm bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-steel-light/20">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-orange">
                  {project.category}
                </span>
                <h3 className="mt-1 text-lg text-charcoal">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{project.summary}</p>
                {project.location && (
                  <p className="mt-3 text-xs uppercase tracking-wide text-steel-light">
                    {project.location}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
