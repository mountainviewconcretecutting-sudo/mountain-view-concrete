"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Checks if the current request user is authenticated and registered in `admin_profiles`.
 */
export async function getIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return false;

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    return !!profile;
  } catch {
    return false;
  }
}

/**
 * Fetches a single site_content entry by key with a fallback default value.
 */
export async function getSiteContent(
  key: string,
  defaultValue: string
): Promise<string> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data || data.value === null || data.value === undefined) {
      return defaultValue;
    }
    return data.value;
  } catch {
    return defaultValue;
  }
}

/**
 * Batch fetches site_content entries for multiple keys with fallback defaults.
 */
export async function getSiteContents<T extends Record<string, string>>(
  keys: (keyof T & string)[],
  defaults: T
): Promise<T> {
  const result = { ...defaults };
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", keys);

    if (!error && data) {
      for (const row of data) {
        if (row.key in result && row.value !== null && row.value !== undefined) {
          (result as Record<string, string>)[row.key] = row.value;
        }
      }
    }
  } catch {
    // Return defaults on error
  }
  return result;
}

/**
 * Updates or creates a site_content entry by key.
 * Requires authenticated admin user.
 */
export async function updateSiteContent(
  key: string,
  value: string
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!(await getIsAdmin())) {
      return { success: false, message: "Unauthorized: Admin profile required." };
    }

    const supabase = await createSupabaseServerClient();
    const { error: upsertError } = await supabase
      .from("site_content")
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (upsertError) {
      return { success: false, message: upsertError.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update content";
    return {
      success: false,
      message: msg,
    };
  }
}
