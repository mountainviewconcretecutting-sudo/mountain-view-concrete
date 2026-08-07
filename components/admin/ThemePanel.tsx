"use client";

import { useState, useCallback, useRef } from "react";
import { updateThemeColor } from "@/lib/actions/theme";
import { THEME_COLOR_DEFAULTS } from "@/lib/utils/colors";
import { Palette, CheckCircle, AlertCircle, Loader2, RotateCcw } from "lucide-react";

const TOKEN_LABELS: Record<string, string> = {
  color_orange: "Primary Orange",
  color_orange_hover: "Orange (Hover)",
  color_orange_soft: "Orange (Soft / Background)",
  color_charcoal: "Charcoal (Primary Dark)",
  color_charcoal_soft: "Charcoal (Soft Surface)",
  color_charcoal_hard: "Charcoal (Hard / Deep)",
};

type SaveState = "idle" | "saving" | "saved" | "error";

interface ColorRowState {
  value: string;
  saveState: SaveState;
  errorMsg: string | null;
}

type RowsMap = Record<string, ColorRowState>;

interface ThemePanelProps {
  initialColors: Record<string, string>;
}

/**
 * Returns the ColorRowState for a given key, guaranteed non-undefined.
 * All keys are seeded in the useState initializer so this should never
 * fall through to the fallback, but the guard keeps TypeScript happy.
 */
function getRow(rows: RowsMap, key: string): ColorRowState {
  return rows[key] ?? { value: THEME_COLOR_DEFAULTS[key] ?? "#000000", saveState: "idle", errorMsg: null };
}

export default function ThemePanel({ initialColors }: ThemePanelProps) {
  const [rows, setRows] = useState<RowsMap>(() => {
    const init: RowsMap = {};
    for (const key of Object.keys(THEME_COLOR_DEFAULTS)) {
      init[key] = {
        value: initialColors[key] ?? THEME_COLOR_DEFAULTS[key] ?? "#000000",
        saveState: "idle",
        errorMsg: null,
      };
    }
    return init;
  });

  // Per-key debounce timers
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleChange = useCallback((key: string, value: string) => {
    setRows((prev): RowsMap => ({
      ...prev,
      [key]: { ...getRow(prev, key), value, saveState: "idle", errorMsg: null },
    }));

    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      setRows((prev): RowsMap => ({
        ...prev,
        [key]: { ...getRow(prev, key), saveState: "saving" },
      }));

      const result = await updateThemeColor(key, value);

      setRows((prev): RowsMap => ({
        ...prev,
        [key]: {
          ...getRow(prev, key),
          saveState: result.success ? "saved" : "error",
          errorMsg: result.success ? null : (result.message ?? "Failed to save"),
        },
      }));

      // Auto-clear "saved" badge after 2.5s
      if (result.success) {
        setTimeout(() => {
          setRows((prev): RowsMap => ({
            ...prev,
            [key]: { ...getRow(prev, key), saveState: "idle" },
          }));
        }, 2500);
      }
    }, 600);
  }, []);

  const handleReset = useCallback(
    (key: string) => {
      const defaultVal = THEME_COLOR_DEFAULTS[key] ?? "#000000";
      handleChange(key, defaultVal);
    },
    [handleChange]
  );

  return (
    <div className="border-2 border-slurry/50 bg-aggregate-deep p-6 text-chalk shadow-[3px_3px_0px_#0F1115]">
      <div className="mb-5 flex items-center gap-2 border-b border-slurry/40 pb-4">
        <Palette size={20} className="text-flame" aria-hidden="true" />
        <p className="font-body text-sm text-steel-light">
          Changes apply site-wide instantly. Use the reset button to restore any token to its brand default.
        </p>
      </div>

      <div className="divide-y divide-slurry/30">
        {Object.keys(THEME_COLOR_DEFAULTS).map((key) => {
          const row = getRow(rows, key);
          const defaultVal = THEME_COLOR_DEFAULTS[key] ?? "#000000";
          const isDefault = row.value === defaultVal;

          return (
            <div
              key={key}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Color swatch + native picker */}
              <div className="relative flex-none">
                <div
                  className="h-10 w-10 border-2 border-slurry/60 shadow-sm"
                  style={{ backgroundColor: row.value }}
                  aria-hidden="true"
                />
                <input
                  id={`theme-picker-${key}`}
                  type="color"
                  value={row.value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  title={`Pick a color for ${TOKEN_LABELS[key] ?? key}`}
                  aria-label={`Color picker for ${TOKEN_LABELS[key] ?? key}`}
                />
              </div>

              {/* Label + hex text input */}
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`theme-hex-${key}`}
                  className="block font-tech text-xs font-bold uppercase tracking-wider text-chalk"
                >
                  {TOKEN_LABELS[key] ?? key}
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    id={`theme-hex-${key}`}
                    type="text"
                    value={row.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Update local state immediately for typing feedback
                      setRows((prev): RowsMap => ({
                        ...prev,
                        [key]: { ...getRow(prev, key), value: val, saveState: "idle", errorMsg: null },
                      }));
                      // Only trigger a save once we have a valid 6-digit hex
                      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                        handleChange(key, val);
                      }
                    }}
                    maxLength={7}
                    placeholder="#000000"
                    className="w-28 border-2 border-slurry/60 bg-aggregate px-2.5 py-1.5 font-mono text-xs text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
                    aria-label={`Hex value for ${TOKEN_LABELS[key] ?? key}`}
                  />
                  {/* Reset to brand default */}
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={() => handleReset(key)}
                      title="Reset to brand default"
                      className="flex items-center gap-1 border border-slurry/50 bg-slurry/20 px-2 py-1 font-tech text-xs font-bold text-steel-light hover:border-flame hover:text-flame transition-colors"
                    >
                      <RotateCcw size={12} />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Per-row save status */}
              <div className="flex-none w-24 text-right">
                {row.saveState === "saving" && (
                  <span className="inline-flex items-center gap-1 font-tech text-xs font-bold text-steel-light">
                    <Loader2 size={12} className="animate-spin" />
                    Saving…
                  </span>
                )}
                {row.saveState === "saved" && (
                  <span className="inline-flex items-center gap-1 font-tech text-xs font-bold text-mtnGreen">
                    <CheckCircle size={12} />
                    Saved
                  </span>
                )}
                {row.saveState === "error" && (
                  <span
                    className="inline-flex items-center gap-1 font-tech text-xs font-bold text-flame"
                    title={row.errorMsg ?? undefined}
                  >
                    <AlertCircle size={12} />
                    Error
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
