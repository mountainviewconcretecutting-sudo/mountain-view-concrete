"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { upsertService, deleteService } from "@/lib/actions/admin";
import type { Service } from "@/lib/types";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

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
          <div key={service.id} className="border-2 border-slurry/50 bg-aggregate-deep p-5 text-chalk shadow-[3px_3px_0px_#0F1115]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-tech text-xs font-bold uppercase tracking-widest text-flame">
                  slug: #{service.slug} (order: {service.display_order})
                </p>
                <h3 className="font-display text-2xl uppercase tracking-wide text-chalk mt-1">{service.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  aria-label={`Edit ${service.title}`}
                  className="flex h-8 w-8 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  aria-label={`Delete ${service.title}`}
                  className="flex h-8 w-8 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mt-2 font-body text-sm text-steel-light line-clamp-3">{service.description}</p>
            {service.spec_list && service.spec_list.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slurry/40 pt-2.5">
                {service.spec_list.slice(0, 3).map((spec) => (
                  <span key={spec} className="border border-slurry/60 bg-slurry/20 px-2 py-0.5 font-tech text-[11px] font-bold uppercase tracking-wider text-flame">
                    {spec}
                  </span>
                ))}
                {service.spec_list.length > 3 && (
                  <span className="font-tech text-xs font-bold uppercase text-steel-light">+{service.spec_list.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-none border-2 border-slurry/60 bg-aggregate-deep p-6 text-chalk shadow-[6px_6px_0px_#0F1115] max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-slurry/40 pb-3 mb-4">
              <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-flame">
                {"// SERVICE EDITOR"}
              </span>
              <h2 className="font-display text-2xl uppercase tracking-wide text-chalk leading-tight">
                {"id" in editing ? "Edit Service" : "New Service"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Service Title <span className="text-flame">*</span>
                </label>
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
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    Anchor Slug <span className="text-flame">*</span>
                  </label>
                  <input
                    placeholder="slug (e.g. wall-sawing)"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    Display Order
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={editing.display_order}
                    onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Description <span className="text-flame">*</span>
                </label>
                <textarea
                  placeholder="Service description"
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                />
              </div>

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Capabilities / Specifications (comma-separated)
                </label>
                <input
                  placeholder="Up to 24&quot; depth, Track-mounted saws, Flush cutting"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    Icon Reference
                  </label>
                  <input
                    placeholder="Scissors, CircleDot, HardHat, Wrench"
                    value={editing.icon_name || "Scissors"}
                    onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                  />
                  {editing.icon_name && !["Scissors", "CircleDot", "HardHat", "Wrench"].includes(editing.icon_name) && (
                    <p className="mt-1 font-tech text-xs font-bold text-flame">
                      ⚠️ Unrecognized icon name (&quot;{editing.icon_name}&quot;) — will display as default (Scissors)
                    </p>
                  )}
                </div>
                <div>
                  <ImageDropzone
                    currentUrl={editing.image_url || ""}
                    onUploadSuccess={(url) => setEditing({ ...editing, image_url: url })}
                    label="Service Card Image (Drag & Drop to Upload)"
                  />
                  <input
                    placeholder="Or enter Image URL manually"
                    value={editing.image_url || ""}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full border-2 border-slurry/60 bg-aggregate px-3 py-2 font-mono text-xs text-chalk placeholder:text-steel-light mt-2"
                  />
                </div>
              </div>

              {error && <p className="border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">{error}</p>}

              <div className="mt-4 flex justify-end gap-3 border-t border-slurry/40 pt-4">
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
