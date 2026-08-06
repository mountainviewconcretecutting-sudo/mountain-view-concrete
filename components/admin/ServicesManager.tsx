"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { upsertService, deleteService } from "@/lib/actions/admin";
import type { Service } from "@/lib/types";

const EMPTY: Omit<Service, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  description: "",
  spec_list: [],
  icon_name: "Scissors",
  image_url: "",
  display_order: 0,
};

export default function ServicesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | (typeof EMPTY) | null>(null);
  const [specInput, setSpecInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openEdit(service: Service | typeof EMPTY) {
    setEditing(service);
    setSpecInput(service.spec_list ? service.spec_list.join(", ") : "");
    setError("");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const specList = specInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...editing,
      spec_list: specList,
    };

    const result = await upsertService(payload as Service);
    setSaving(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    await deleteService(id);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => openEdit(EMPTY)} className="btn-secondary">
          <Plus size={16} aria-hidden="true" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-sm border border-steel-light/30 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
                  slug: #{service.slug} (order: {service.display_order})
                </p>
                <h3 className="text-base font-medium text-charcoal">{service.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  aria-label={`Edit ${service.title}`}
                  className="rounded p-1.5 text-steel hover:bg-fog hover:text-charcoal"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  aria-label={`Delete ${service.title}`}
                  className="rounded p-1.5 text-steel hover:bg-orange-soft hover:text-orange-hover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-steel line-clamp-3">{service.description}</p>
            {service.spec_list && service.spec_list.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 border-t border-steel-light/20 pt-2">
                {service.spec_list.slice(0, 3).map((spec) => (
                  <span key={spec} className="rounded-xs bg-fog px-2 py-0.5 font-mono text-[10px] text-steel">
                    {spec}
                  </span>
                ))}
                {service.spec_list.length > 3 && (
                  <span className="font-mono text-[10px] text-steel">+{service.spec_list.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-hard/70 p-4">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg uppercase text-charcoal">
              {"id" in editing ? "Edit Service" : "New Service"}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">Service Title</label>
                <input
                  placeholder="Title (e.g. Wall Sawing)"
                  value={editing.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setEditing({
                      ...editing,
                      title: newTitle,
                      slug: "id" in editing ? editing.slug : autoSlug,
                    });
                  }}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-steel mb-1">Anchor Slug</label>
                  <input
                    placeholder="slug (e.g. wall-sawing)"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-steel mb-1">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={editing.display_order}
                    onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                    className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">Description</label>
                <textarea
                  placeholder="Service description"
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">
                  Capabilities / Specifications (comma-separated)
                </label>
                <input
                  placeholder="Up to 24&quot; depth, Track-mounted saws, Flush cutting"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-steel mb-1">Icon Reference</label>
                  <input
                    placeholder="Scissors, CircleDot, HardHat, Wrench"
                    value={editing.icon_name || "Scissors"}
                    onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                    className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                  />
                  {editing.icon_name && !["Scissors", "CircleDot", "HardHat", "Wrench"].includes(editing.icon_name) && (
                    <p className="mt-1 text-xs font-medium text-orange-hover">
                      ⚠️ Unrecognized icon name (&quot;{editing.icon_name}&quot;) — will display as default (Scissors)
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-steel mb-1">Optional Image URL</label>
                  <input
                    placeholder="https://..."
                    value={editing.image_url || ""}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-sm font-medium text-orange-hover">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
