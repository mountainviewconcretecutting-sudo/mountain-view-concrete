"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult, LeadStatus, Project } from "@/lib/types";

export async function adminLogin(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, message: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function adminLogout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

const projectSchema = z.object({
  title: z.string().min(2).max(150),
  category: z.enum(["residential", "commercial", "industrial"]),
  service_type: z.enum([
    "wall_sawing",
    "slab_sawing",
    "core_drilling",
    "demolition_removal",
    "additional_property_services",
    "other",
  ]),
  summary: z.string().min(10).max(500),
  image_url: z.string().url(),
  location: z.string().max(150).optional(),
  is_featured: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export async function upsertProject(
  input: Partial<Project> & { id?: string }
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the project fields and try again." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = input.id
    ? await supabase.from("projects").update(parsed.data).eq("id", input.id)
    : await supabase.from("projects").insert(parsed.data);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true, message: "Project saved." };
}

export async function deleteProject(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}
