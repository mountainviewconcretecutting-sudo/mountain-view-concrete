"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, ImageOff } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { upsertEquipment, deleteEquipment } from "@/lib/actions/admin";
import type { Equipment } from "@/lib/types";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

const EMPTY: Omit<Equipment, "id" | "created_at" | "updated_at"> = {
  name: "",
  description: "",
  specs: [],
  image_url: "",
  display_order: 0,
};

export default function EquipmentManager({ equipment }: { equipment: Equipment[] }) {
  const [editing, setEditing] = useState<Equipment | (typeof EMPTY) | null>(null);
  const [specsInput, setSpecsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openEdit(item: Equipment | typeof EMPTY) {
    setEditing(item);
    setSpecsInput(item.specs ? item.specs.join(", ") : "");
    setError("");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const specsList = specsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...editing,
      specs: specsList,
    };

    const result = await upsertEquipment(payload as Equipment);
    setSaving(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this equipment entry? This cannot be undone.")) return;
    await deleteEquipment(id);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => openEdit(EMPTY)} className="btn-secondary">
          <Plus size={16} aria-hidden="true" /> Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => (
          <div key={item.id} className="rounded-sm border border-steel-light/30 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-orange">
                  Order: {item.display_order}
                </p>
                <h3 className="text-base font-medium text-charcoal">{item.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.name}`}
                  className="rounded p-1.5 text-steel hover:bg-fog hover:text-charcoal"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.name}`}
                  className="rounded p-1.5 text-steel hover:bg-orange-soft hover:text-orange-hover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {item.image_url ? (
              <div className="relative mt-3 h-32 w-full overflow-hidden rounded-sm border border-steel-light/20">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                  fallbackText="No Image Provided"
                  iconSize={16}
                />
              </div>
            ) : (
              <div className="mt-3 flex h-24 w-full items-center justify-center rounded-sm bg-fog text-steel border border-steel-light/20">
                <div className="flex items-center gap-1.5 text-xs">
                  <ImageOff size={16} /> No Image Provided
                </div>
              </div>
            )}

            {item.description && <p className="mt-2 text-sm text-steel">{item.description}</p>}

            {item.specs && item.specs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 border-t border-steel-light/20 pt-2">
                {item.specs.map((spec) => (
                  <span key={spec} className="rounded-xs bg-fog px-2 py-0.5 font-mono text-[10px] text-steel">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-hard/70 p-4">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg uppercase text-charcoal">
              {"id" in editing ? "Edit Equipment" : "New Equipment"}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">Equipment Name</label>
                <input
                  placeholder="Name (e.g. Mini excavator / Bobcat)"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
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

              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Brief machinery description"
                  rows={2}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-steel mb-1">
                  Specifications (comma-separated list)
                </label>
                <input
                  placeholder="Rubber tracks, Hydraulic breaker, Zero tail-swing"
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <ImageDropzone
                  currentUrl={editing.image_url || ""}
                  onUploadSuccess={(url) => setEditing({ ...editing, image_url: url })}
                  label="Equipment Photo (Drag & Drop to Upload)"
                />
                <input
                  placeholder="Or enter Image URL manually"
                  value={editing.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm font-mono text-xs mt-1"
                />
              </div>

              {error && <p className="text-sm font-medium text-orange-hover">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
                  {saving ? "Saving..." : "Save Equipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
