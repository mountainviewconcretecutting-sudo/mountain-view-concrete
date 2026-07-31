"use client";

import { useEditMode } from "./EditModeContext";
import { Edit3, CheckCircle2 } from "lucide-react";

export default function EditModeToggle() {
  const { isAdmin, isEditMode, setIsEditMode } = useEditMode();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={() => setIsEditMode((prev) => !prev)}
        className={`group flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-xs uppercase tracking-wider text-white shadow-xl transition-all duration-200 border ${
          isEditMode
            ? "bg-orange border-orange-light shadow-orange/30 ring-2 ring-orange/50"
            : "bg-charcoal/95 border-white/20 hover:border-orange hover:bg-charcoal backdrop-blur-md"
        }`}
        title={isEditMode ? "Turn off page edit mode" : "Turn on page edit mode"}
      >
        <span
          className={`flex h-2 w-2 rounded-full ${
            isEditMode ? "bg-white animate-pulse" : "bg-emerald-400"
          }`}
        />
        {isEditMode ? (
          <>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Edit Mode: <strong className="font-bold">ON</strong></span>
          </>
        ) : (
          <>
            <Edit3 size={16} aria-hidden="true" />
            <span>Edit Mode: <strong className="opacity-80">OFF</strong></span>
          </>
        )}
      </button>
    </div>
  );
}
