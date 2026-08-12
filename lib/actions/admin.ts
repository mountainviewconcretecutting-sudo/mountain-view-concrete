"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/actions/siteContent";
import type { ActionResult, LeadStatus, Project, Post, Service, Equipment } from "@/lib/types";

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

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export async function updateAdminPassword(
  values: { newPassword?: string; confirmPassword?: string }
): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue ? issue.message : "Please check your password entries.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Admin password updated successfully." };
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  try {
    const supabase = await createSupabaseServerClient();
    const { error, count } = await supabase
      .from("leads")
      .update({ status }, { count: "exact" })
      .eq("id", leadId);

    if (error || count === 0) {
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { error: serviceErr } = await serviceSupabase
        .from("leads")
        .update({ status })
        .eq("id", leadId);
      if (serviceErr) throw new Error(serviceErr.message);
    }
  } catch {
    const serviceSupabase = createSupabaseServiceRoleClient();
    const { error: serviceErr } = await serviceSupabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);
    if (serviceErr) throw new Error(serviceErr.message);
  }

  revalidatePath("/admin");
}

export async function deleteLead(leadId: string) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  try {
    const supabase = await createSupabaseServerClient();
    const { error, count } = await supabase
      .from("leads")
      .delete({ count: "exact" })
      .eq("id", leadId);

    if (error || count === 0) {
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { error: serviceErr } = await serviceSupabase
        .from("leads")
        .delete()
        .eq("id", leadId);
      if (serviceErr) throw new Error(serviceErr.message);
    }
  } catch {
    const serviceSupabase = createSupabaseServiceRoleClient();
    const { error: serviceErr } = await serviceSupabase
      .from("leads")
      .delete()
      .eq("id", leadId);
    if (serviceErr) throw new Error(serviceErr.message);
  }

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

const imagePathOrUrlSchema = z
  .string()
  .refine(
    (val) => val === "" || val.startsWith("/") || /^https?:\/\//i.test(val),
    { message: "Must be a valid URL (http/https) or local path starting with '/'" }
  );

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
  image_url: imagePathOrUrlSchema,
  location: z.string().max(150).optional().nullable(),
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
  cover_image_url: imagePathOrUrlSchema.optional().nullable(),
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

const serviceSchema = z.object({
  title: z.string().min(2, "Title is required").max(150),
  slug: z.string().min(2, "Slug is required").max(150),
  description: z.string().min(5, "Description is required"),
  spec_list: z.array(z.string()).optional().nullable(),
  icon_name: z.string().optional().nullable(),
  image_url: imagePathOrUrlSchema.optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
});

export async function upsertService(
  input: Partial<Service> & { id?: string }
): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the service fields and try again." };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    spec_list: parsed.data.spec_list || null,
    icon_name: parsed.data.icon_name || null,
    image_url: parsed.data.image_url || null,
    display_order: parsed.data.display_order,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createSupabaseServerClient();
  const { error } = input.id
    ? await supabase.from("services").update(payload).eq("id", input.id)
    : await supabase.from("services").insert(payload);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true, message: "Service saved." };
}

export async function deleteService(serviceId: string) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").delete().eq("id", serviceId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
}

const equipmentSchema = z.object({
  name: z.string().min(2, "Name is required").max(150),
  description: z.string().optional().nullable(),
  specs: z.array(z.string()).optional().nullable(),
  image_url: imagePathOrUrlSchema.optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
});

export async function upsertEquipment(
  input: Partial<Equipment> & { id?: string }
): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the equipment fields and try again." };
  }

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    specs: parsed.data.specs || null,
    image_url: parsed.data.image_url || null,
    display_order: parsed.data.display_order,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createSupabaseServerClient();
  const { error } = input.id
    ? await supabase.from("equipment").update(payload).eq("id", input.id)
    : await supabase.from("equipment").insert(payload);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true, message: "Equipment saved." };
}

export async function deleteEquipment(equipmentId: string) {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("equipment").delete().eq("id", equipmentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
}

const upsertGalleryImageSchema = z.object({
  id: z.string().optional(),
  image_url: z.string().url("Must be a valid image URL."),
  alt_text: z.string().optional(),
  display_order: z.number().int().min(0, "Display order must be 0 or greater."),
});

export async function upsertGalleryImage(input: {
  id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
}): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  const parsed = upsertGalleryImageSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      message: issue ? issue.message : "Invalid gallery image input.",
    };
  }

  const payload = {
    image_url: parsed.data.image_url,
    alt_text: parsed.data.alt_text || null,
    display_order: parsed.data.display_order,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = input.id
    ? await supabase.from("gallery_images").update(payload).eq("id", input.id)
    : await supabase.from("gallery_images").insert(payload);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, message: "Gallery image saved." };
}

export async function deleteGalleryImage(id: string): Promise<void> {
  if (!(await getIsAdmin())) throw new Error("Unauthorized: Admin access required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function reorderGalleryImages(orderedIds: string[]): Promise<ActionResult> {
  if (!(await getIsAdmin())) {
    return { success: false, message: "Unauthorized: Admin access required." };
  }

  if (!orderedIds || orderedIds.length === 0) {
    return { success: true, message: "No items to reorder." };
  }

  const supabase = await createSupabaseServerClient();

  for (let index = 0; index < orderedIds.length; index++) {
    const id = orderedIds[index];
    const { error } = await supabase
      .from("gallery_images")
      .update({ display_order: index })
      .eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, message: "Gallery order updated." };
}



