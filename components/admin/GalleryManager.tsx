"use client";

import { useState } from "react";
import { Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Loader2 } from "lucide-react";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import ImageWithFallback from "@/components/ImageWithFallback";
import { upsertGalleryImage, deleteGalleryImage, reorderGalleryImages } from "@/lib/actions/admin";
import type { GalleryImage } from "@/lib/types";

interface GalleryManagerProps {
  images: GalleryImage[];
}

export default function GalleryManager({ images }: GalleryManagerProps) {
  const [altTexts, setAltTexts] = useState<Record<string, string>>(() =>
    images.reduce((acc, img) => ({ ...acc, [img.id]: img.alt_text ?? "" }), {})
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUploadComplete(url: string) {
    setUploading(true);
    setError("");
    const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.display_order)) : -1;
    const nextOrder = maxOrder + 1;

    const result = await upsertGalleryImage({
      image_url: url,
      alt_text: "",
      display_order: nextOrder,
    });

    setUploading(false);
    if (!result.success) {
      setError(result.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery image?")) return;
    setBusyId(id);
    try {
      await deleteGalleryImage(id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveAlt(img: GalleryImage) {
    const currentAlt = altTexts[img.id] ?? "";
    if (currentAlt === (img.alt_text ?? "")) return;

    setBusyId(img.id);
    const result = await upsertGalleryImage({
      id: img.id,
      image_url: img.image_url,
      alt_text: currentAlt,
      display_order: img.display_order,
    });
    setBusyId(null);

    if (!result.success) {
      setError(result.message);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    if (!moved) return;
    updated.splice(targetIndex, 0, moved);

    const orderedIds = updated.map((img) => img.id);
    setBusyId("reorder");
    const result = await reorderGalleryImages(orderedIds);
    setBusyId(null);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-sm border border-red-500/50 bg-red-500/10 p-4 font-body text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Image Upload Area */}
      <div className="industrial-card">
        <h3 className="mb-2 font-display text-lg uppercase tracking-wide text-chalk">
          Upload New Gallery Image
        </h3>
        <p className="mb-4 font-body text-xs text-steel-light">
          Drag and drop or click to upload photos to the homepage image gallery photo wall.
        </p>
        <ImageDropzone
          bucketName="site-images"
          onUploadSuccess={handleUploadComplete}
        />
        {uploading && (
          <div className="mt-3 flex items-center gap-2 font-tech text-xs text-flame">
            <Loader2 className="animate-spin" size={14} />
            Adding image to gallery...
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="chamfer-top-right border-2 border-dashed border-slurry/60 bg-aggregate-deep p-12 text-center">
          <ImageIcon size={36} className="mx-auto mb-3 text-steel-light" aria-hidden="true" />
          <h3 className="font-display text-xl uppercase tracking-wider text-chalk">
            NO GALLERY IMAGES YET
          </h3>
          <p className="mt-2 font-body text-sm text-steel-light">
            Upload your first photo above to activate the homepage image carousel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="industrial-card flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Preview */}
                <div className="relative mb-3 h-48 w-full overflow-hidden border border-slurry/50 bg-slurry/30">
                  <ImageWithFallback
                    src={img.image_url}
                    alt={img.alt_text || "Gallery image"}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute left-2 top-2 border border-flame/40 bg-aggregate-deep/90 px-2 py-0.5 font-tech text-[10px] font-bold text-flame">
                    #{index + 1}
                  </div>
                </div>

                {/* Alt Text Input */}
                <div className="space-y-1">
                  <label
                    htmlFor={`alt-${img.id}`}
                    className="block font-tech text-[10px] font-bold uppercase tracking-wider text-steel-light"
                  >
                    Alt Text (Description)
                  </label>
                  <input
                    id={`alt-${img.id}`}
                    type="text"
                    value={altTexts[img.id] ?? ""}
                    onChange={(e) =>
                      setAltTexts({ ...altTexts, [img.id]: e.target.value })
                    }
                    onBlur={() => handleSaveAlt(img)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveAlt(img);
                      }
                    }}
                    placeholder="e.g. Concrete wall sawing in Calgary site"
                    className="w-full border border-slurry/60 bg-aggregate px-3 py-1.5 font-body text-xs text-chalk placeholder:text-steel-light/50 focus:border-flame focus:outline-none"
                  />
                </div>
              </div>

              {/* Controls (Move Up/Down & Delete) */}
              <div className="mt-4 flex items-center justify-between border-t border-slurry/40 pt-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0 || busyId === "reorder"}
                    title="Move earlier"
                    className="flex h-8 w-8 items-center justify-center border border-slurry/60 bg-aggregate text-steel-light transition-colors hover:border-flame hover:text-chalk disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === images.length - 1 || busyId === "reorder"}
                    title="Move later"
                    className="flex h-8 w-8 items-center justify-center border border-slurry/60 bg-aggregate text-steel-light transition-colors hover:border-flame hover:text-chalk disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={busyId === img.id}
                  title="Delete image"
                  className="flex h-8 w-8 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-30"
                >
                  {busyId === img.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
