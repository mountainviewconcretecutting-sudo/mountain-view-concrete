"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { upsertProject, deleteProject } from "@/lib/actions/admin";
import type { Project, ProjectCategory, ServiceType } from "@/lib/types";
import { SERVICE_TYPE_LABELS } from "@/lib/types";

const EMPTY: Omit<Project, "id" | "created_at"> = {
  title: "",
  category: "residential",
  service_type: "slab_sawing",
  summary: "",
  image_url: "",
  location: "",
  completed_on: null,
  is_featured: true,
  sort_order: 0,
};

export default function ProjectsManager({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | (typeof EMPTY) | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const result = await upsertProject(editing as Project);
    setSaving(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-secondary">
          <Plus size={16} aria-hidden="true" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-sm border border-steel-light/30 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
                  {project.category}
                </p>
                <h3 className="text-base font-medium text-charcoal">{project.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(project)}
                  aria-label={`Edit ${project.title}`}
                  className="rounded p-1.5 text-steel hover:bg-fog hover:text-charcoal"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  aria-label={`Delete ${project.title}`}
                  className="rounded p-1.5 text-steel hover:bg-orange-soft hover:text-orange-hover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-steel">{project.summary}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-hard/70 p-4">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg uppercase text-charcoal">
              {"id" in editing ? "Edit Project" : "New Project"}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <input
                placeholder="Title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as ProjectCategory })}
                  className="rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
                <select
                  value={editing.service_type}
                  onChange={(e) => setEditing({ ...editing, service_type: e.target.value as ServiceType })}
                  className="rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                >
                  {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Summary"
                rows={3}
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                className="rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
              />
              <input
                placeholder="Image URL (Supabase Storage public URL)"
                value={editing.image_url}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                className="rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editing.is_featured}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                />
                Show on homepage (featured)
              </label>

              {error && <p className="text-sm font-medium text-orange-hover">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
