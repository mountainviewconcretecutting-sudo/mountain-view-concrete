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
          <div key={item.id} className="border-2 border-slurry/50 bg-aggregate-deep p-5 text-chalk shadow-[3px_3px_0px_#0F1115]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-tech text-xs font-bold uppercase tracking-widest text-flame">
                  Order: {item.display_order}
                </p>
                <h3 className="font-display text-2xl uppercase tracking-wide text-chalk mt-1">{item.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {item.image_url ? (
              <div className="relative mt-3 h-32 w-full overflow-hidden border border-slurry/50 bg-aggregate">
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
              <div className="mt-3 flex h-24 w-full items-center justify-center border border-slurry/40 bg-aggregate text-steel-light">
                <div className="flex items-center gap-1.5 font-tech text-xs font-bold uppercase">
                  <ImageOff size={16} /> No Image Provided
                </div>
              </div>
            )}

            {item.description && <p className="mt-2 font-body text-sm text-steel-light">{item.description}</p>}

            {item.specs && item.specs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slurry/40 pt-2.5">
                {item.specs.map((spec) => (
                  <span key={spec} className="border border-slurry/60 bg-slurry/20 px-2 py-0.5 font-tech text-[11px] font-bold uppercase tracking-wider text-flame">
                    {spec}
                  </span>
                ))}
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
                {"// EQUIPMENT EDITOR"}
              </span>
              <h2 className="font-display text-2xl uppercase tracking-wide text-chalk leading-tight">
                {"id" in editing ? "Edit Equipment" : "New Equipment"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Equipment Name <span className="text-flame">*</span>
                </label>
                <input
                  placeholder="Name (e.g. Mini excavator / Bobcat)"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
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

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Brief machinery description"
                  rows={2}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                />
              </div>

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Specifications (comma-separated list)
                </label>
                <input
                  placeholder="Rubber tracks, Hydraulic breaker, Zero tail-swing"
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
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
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3 py-2 font-mono text-xs text-chalk placeholder:text-steel-light mt-2"
                />
              </div>

              {error && <p className="border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">{error}</p>}

              <div className="mt-4 flex justify-end gap-3 border-t border-slurry/40 pt-4">
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
