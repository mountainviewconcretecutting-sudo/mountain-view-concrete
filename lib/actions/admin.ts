"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/actions/siteContent";
import type { ActionResult, LeadStatus, Project, Post } from "@/lib/types";

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
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateTestimonialStatus(
  testimonialId: string,
  status: "pending" | "approved" | "rejected"
) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", testimonialId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
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
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

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
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}

const postSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  slug: z.string().min(2, "Slug is required").max(200),
  body: z.string().min(5, "Body content is required"),
  cover_image_url: z.string().url().optional().nullable().or(z.literal("")),
  is_published: z.boolean(),
});

export async function upsertPost(
  input: Partial<Post> & { id?: string }
): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the post fields and try again." };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    body: parsed.data.body,
    cover_image_url: parsed.data.cover_image_url || null,
    is_published: parsed.data.is_published,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createSupabaseServerClient();
  const { error } = input.id
    ? await supabase.from("posts").update(payload).eq("id", input.id)
    : await supabase.from("posts").insert(payload);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/updates");
  if (parsed.data.slug) {
    revalidatePath(`/updates/${parsed.data.slug}`);
  }
  return { success: true, message: "Post saved." };
}

export async function deletePost(postId: string) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/updates");
}

export async function updateCommentStatus(
  commentId: string,
  status: "pending" | "approved" | "rejected"
) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", commentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/updates");
  revalidatePath("/projects");
}

export async function deleteComment(commentId: string) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/updates");
  revalidatePath("/projects");
}


