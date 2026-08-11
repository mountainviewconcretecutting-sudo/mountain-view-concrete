"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditMode } from "./EditModeContext";
import { updateSiteContent } from "@/lib/actions/siteContent";
import { renderEditableField } from "@/lib/editable-fields";
import { Pencil, Check, X, Loader2 } from "lucide-react";

interface EditableTextProps {
  contentKey: string;
  initialValue: string;
  isAdmin: boolean;
  className?: string;
  multiline?: boolean;
}


export default function EditableText({
  contentKey,
  initialValue,
  isAdmin,
  className = "",
  multiline = true,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const normalizedInitial = (initialValue || "").replace(/\\n/g, "\n");
  const [text, setText] = useState(normalizedInitial);
  const [draftText, setDraftText] = useState(normalizedInitial);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state if initialValue changes
  useEffect(() => {
    const norm = (initialValue || "").replace(/\\n/g, "\n");
    setText(norm);
    setDraftText(norm);
  }, [initialValue]);

  // Focus and select textarea on edit start
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  // If non-admin or edit mode is off, render plain text with zero edit UI
  if (!isAdmin || !isEditMode) {
    return <>{renderEditableField(contentKey, text)}</>;
  }

  const handleSave = async (valueToSave: string) => {
    const trimmed = valueToSave.trim();
    if (trimmed === text) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    setErrorMsg(null);

    const res = await updateSiteContent(contentKey, trimmed);
    setIsSaving(false);

    if (res.success) {
      setText(trimmed);
      setIsEditing(false);
    } else {
      setErrorMsg(res.message || "Failed to save");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !multiline)) {
      e.preventDefault();
      handleSave(draftText);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setDraftText(text);
      setErrorMsg(null);
    }
  };

  if (isEditing) {
    return (
      <div className={`relative inline-block w-full rounded-md border-2 border-orange bg-charcoal-hard/90 p-3 shadow-2xl z-20 ${className}`}>
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.max(2, draftText.split("\n").length)}
            className="w-full resize-y rounded bg-charcoal p-2.5 text-base font-normal text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-orange"
            disabled={isSaving}
          />
        ) : (
          <input
            type="text"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded bg-charcoal p-2 text-base font-normal text-white focus:outline-none focus:ring-1 focus:ring-orange"
            disabled={isSaving}
          />
        )}

        {errorMsg && (
          <p className="mt-1.5 text-xs text-red-400 font-medium">{errorMsg}</p>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
          <span className="text-white/50 hidden sm:inline">
            Press <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px]">Ctrl+Enter</kbd> to save
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDraftText(text);
                setErrorMsg(null);
              }}
              disabled={isSaving}
              className="flex items-center gap-1 rounded px-2.5 py-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={14} /> Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(draftText)}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded bg-orange px-3 py-1 font-semibold text-white hover:bg-orange-hover transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check size={14} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        setIsEditing(true);
        setDraftText(text);
      }}
      className={`group relative cursor-pointer rounded-lg border-2 border-dashed border-transparent p-1.5 hover:border-orange/70 hover:bg-orange/5 transition-all duration-200 ${className}`}
      title="Click to edit text inline"
    >
      <span className="absolute -top-3 -right-3 z-10 hidden items-center gap-1 rounded-full bg-orange px-2 py-0.5 font-display text-[10px] uppercase tracking-wider text-white shadow-md group-hover:flex animate-fade-in">
        <Pencil size={11} aria-hidden="true" /> Edit
      </span>
      {renderEditableField(contentKey, text)}
    </div>
  );
}
