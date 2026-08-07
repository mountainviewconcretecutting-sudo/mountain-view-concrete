"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { upsertProject, deleteProject } from "@/lib/actions/admin";
import type { Project, ProjectCategory, ServiceType } from "@/lib/types";
import { SERVICE_TYPE_LABELS } from "@/lib/types";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

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
          <div key={project.id} className="border-2 border-slurry/50 bg-aggregate-deep p-5 text-chalk shadow-[3px_3px_0px_#0F1115]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-tech text-xs font-bold uppercase tracking-widest text-flame">
                  {project.category}
                </p>
                <h3 className="font-display text-2xl uppercase tracking-wide text-chalk mt-1">{project.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(project)}
                  aria-label={`Edit ${project.title}`}
                  className="flex h-8 w-8 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  aria-label={`Delete ${project.title}`}
                  className="flex h-8 w-8 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mt-2 font-body text-sm text-steel-light line-clamp-3">{project.summary}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-none border-2 border-slurry/60 bg-aggregate-deep p-6 text-chalk shadow-[6px_6px_0px_#0F1115] max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-slurry/40 pb-3 mb-4">
              <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-flame">
                {"// PROJECT EDITOR"}
              </span>
              <h2 className="font-display text-2xl uppercase tracking-wide text-chalk leading-tight">
                {"id" in editing ? "Edit Project" : "New Project"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Project Title <span className="text-flame">*</span>
                </label>
                <input
                  placeholder="Title"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as ProjectCategory })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-tech text-xs uppercase text-chalk focus:border-flame focus:outline-none"
                  >
                    <option value="residential" className="bg-aggregate-deep text-chalk">Residential</option>
                    <option value="commercial" className="bg-aggregate-deep text-chalk">Commercial</option>
                    <option value="industrial" className="bg-aggregate-deep text-chalk">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    Service Type
                  </label>
                  <select
                    value={editing.service_type}
                    onChange={(e) => setEditing({ ...editing, service_type: e.target.value as ServiceType })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-tech text-xs uppercase text-chalk focus:border-flame focus:outline-none"
                  >
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value} className="bg-aggregate-deep text-chalk">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Summary <span className="text-flame">*</span>
                </label>
                <textarea
                  placeholder="Summary"
                  rows={3}
                  value={editing.summary}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
                />
              </div>

              <div>
                <ImageDropzone
                  currentUrl={editing.image_url}
                  onUploadSuccess={(url) => setEditing({ ...editing, image_url: url })}
                  label="Project Image (Drag & Drop to Upload)"
                />
                <input
                  placeholder="Or enter Image URL manually"
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3 py-2 font-mono text-xs text-chalk placeholder:text-steel-light mt-2"
                />
              </div>

              <label className="flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-wider text-chalk cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_featured}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  className="h-4 w-4 accent-flame"
                />
                Show on homepage (featured)
              </label>

              {error && <p className="border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">{error}</p>}

              <div className="mt-4 flex justify-end gap-3 border-t border-slurry/40 pt-4">
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
