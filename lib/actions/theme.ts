"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/actions/siteContent";
import { THEME_COLOR_DEFAULTS } from "@/lib/utils/colors";

/**
 * Fetches all theme color settings from the DB.
 * Falls back to brand defaults for any missing key so the site
 * always has valid colors even before the table is seeded.
 */
export async function getThemeSettings(): Promise<Record<string, string>> {
  const result = { ...THEME_COLOR_DEFAULTS };
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("theme_settings")
      .select("key, value")
      .in("key", Object.keys(THEME_COLOR_DEFAULTS));

    if (!error && data) {
      for (const row of data) {
        if (row.key in result && typeof row.value === "string") {
          result[row.key] = row.value;
        }
      }
    }
  } catch {
    // Return defaults on any error — site must not break if DB is unreachable
  }
  return result;
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Updates or inserts a single theme color setting.
 * Validates that the value is a valid 6-digit hex color.
 * Requires an authenticated admin session.
 */
export async function updateThemeColor(
  key: string,
  value: string
): Promise<{ success: boolean; message?: string }> {
  if (!(key in THEME_COLOR_DEFAULTS)) {
    return { success: false, message: "Unknown theme key." };
  }
  if (!HEX_RE.test(value)) {
    return { success: false, message: "Value must be a valid hex color (e.g. #E85D04)." };
  }

  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("theme_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) {
      return { success: false, message: error.message };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, message: msg };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
