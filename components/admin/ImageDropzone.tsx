"use client";

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ImageDropzoneProps {
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  bucketName?: string;
  label?: string;
}

export function ImageDropzone({
  currentUrl = "",
  onUploadSuccess,
  bucketName = "site-images",
  label = "Image Upload (Drag & Drop or Click)",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync previewUrl state whenever currentUrl prop changes (e.g. manual typing or switching items)
  useEffect(() => {
    setPreviewUrl(currentUrl);
  }, [currentUrl]);

  const handleUpload = async (file: File) => {
    // 1. Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (.jpg, .png, .webp, .svg).");
      return;
    }
    // 2. Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size must be less than 5MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get Public CDN URL
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setError(msg);
    } finally {
      setIsUploading(false);
      // Reset input value so re-selecting the same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-none cursor-pointer transition-colors ${
          isDragging
            ? "border-orange-500 bg-orange-500/10"
            : "border-slate-700 bg-slate-800/60 hover:border-orange-500/60 hover:bg-slate-800/90"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-2 text-orange-500 pointer-events-none">
            <Loader2 className="w-7 h-7 animate-spin mb-2" />
            <span className="text-xs font-bold uppercase tracking-wider">Uploading to Supabase Storage...</span>
          </div>
        ) : previewUrl ? (
          <div className="flex items-center space-x-4 w-full pointer-events-none">
            <div className="relative w-16 h-16 bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <ImageIcon className="w-6 h-6 text-slate-500 absolute" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center text-emerald-400 text-xs font-bold uppercase mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Image Attached
              </div>
              <p className="text-xs text-slate-400 truncate font-mono">{previewUrl}</p>
              <p className="text-[11px] text-orange-400 font-semibold mt-1">Click or drag new image to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-slate-400 text-center pointer-events-none">
            <Upload className="w-7 h-7 mb-2 text-orange-500" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Drag & drop image here, or <span className="text-orange-500 underline">browse</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-xs text-red-400 bg-red-950/40 p-2.5 border border-red-800">
          <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
