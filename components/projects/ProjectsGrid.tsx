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

  // Group comments by project_id
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
          {filtered.map((project) => {
            const projectComments = commentsByProject[project.id] || [];
            const isCommentsOpen = activeCommentProjectId === project.id;
            const hasImgError = !project.image_url || imgErrors[project.id];

            return (
              <article key={project.id} className="flex flex-col justify-between overflow-hidden rounded-sm bg-white shadow-sm border border-steel-light/20">
                <div>
                  <div className="relative aspect-[4/3] w-full bg-steel-light/20">
                    {hasImgError ? (
                      <div className="flex h-full w-full flex-col items-center justify-center text-steel">
                        <ImageOff size={28} className="text-steel-light" aria-hidden="true" />
                        <span className="mt-1 text-xs">Photo unavailable</span>
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
                </div>

                <div className="border-t border-steel-light/20 p-5 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveCommentProjectId(isCommentsOpen ? null : project.id)
                    }
                    className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-orange hover:text-orange-hover"
                  >
                    <MessageSquare size={14} /> Comments ({projectComments.length})
                    {isCommentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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

