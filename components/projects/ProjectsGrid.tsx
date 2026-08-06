"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MessageSquare, ChevronDown, ChevronUp, ImageOff } from "lucide-react";
import CommentsSection from "@/components/comments/CommentsSection";
import type { Project, ProjectCategory, Comment } from "@/lib/types";

const FILTERS: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

export default function ProjectsGrid({
  projects,
  comments = [],
}: {
  projects: Project[];
  comments?: Comment[];
}) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [activeCommentProjectId, setActiveCommentProjectId] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  const commentsByProject = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    for (const c of comments) {
      if (c.project_id) {
        const list = map[c.project_id] || [];
        list.push(c);
        map[c.project_id] = list;
      }
    }
    return map;
  }, [comments]);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-3">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`border-2 px-5 py-2 font-tech text-xs font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame ${
              filter === value
                ? "border-flame bg-flame text-white shadow-[3px_3px_0px_#0F1115]"
                : "border-slurry/50 bg-slurry/20 text-chalk hover:border-flame hover:bg-slurry/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 border-2 border-dashed border-slurry/50 bg-aggregate-deep p-12 text-center font-body text-sm text-steel-light">
          No projects in this category yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const projectComments = commentsByProject[project.id] || [];
            const isCommentsOpen = activeCommentProjectId === project.id;
            const hasImgError = !project.image_url || imgErrors[project.id];

            return (
              <article key={project.id} className="flex flex-col justify-between border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]">
                <div>
                  <div className="relative aspect-[4/3] w-full bg-slurry/30 border-b-2 border-slurry/40">
                    {hasImgError ? (
                      <div className="flex h-full w-full flex-col items-center justify-center text-steel">
                        <ImageOff size={32} className="text-steel-light" aria-hidden="true" />
                        <span className="mt-2 font-tech text-xs font-bold uppercase">Photo unavailable</span>
                      </div>
                    ) : (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        onError={() => setImgErrors((prev) => ({ ...prev, [project.id]: true }))}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block border border-flame/40 bg-flame/10 px-2 py-0.5 font-tech text-[10px] font-bold uppercase tracking-widest text-flame mb-2">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">{project.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-steel-light">{project.summary}</p>
                    {project.location && (
                      <p className="mt-3 font-tech text-xs uppercase tracking-wider text-steel">
                        LOCATION: {project.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-slurry/40 p-6 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveCommentProjectId(isCommentsOpen ? null : project.id)
                    }
                    className="inline-flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-wider text-flame hover:underline"
                  >
                    <MessageSquare size={16} /> Comments ({projectComments.length})
                    {isCommentsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isCommentsOpen && (
                    <CommentsSection
                      projectId={project.id}
                      comments={projectComments}
                      title={`Comments on ${project.title}`}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
