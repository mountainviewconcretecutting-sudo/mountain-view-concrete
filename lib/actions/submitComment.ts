"use server";

import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { ActionResult, CommentFormValues } from "@/lib/types";

const commentSchema = z
  .object({
    authorName: z
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(100, "Name is too long."),
    message: z
      .string()
      .trim()
      .min(5, "Please enter a comment (at least 5 characters).")
      .max(1000, "Comment is too long."),
    postId: z.string().uuid().optional().nullable().or(z.literal("")),
    projectId: z.string().uuid().optional().nullable().or(z.literal("")),
    companyWebsite: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
  })
  .refine(
    (data) => (data.postId && !data.projectId) || (!data.postId && data.projectId),
    {
      message: "Comment must target either a post or a project.",
    }
  );

/**
 * Handles public Comment submissions for Posts (/updates/[slug]) and Projects (/projects).
 * - Validates input with Zod.
 * - Honeypot field (`companyWebsite`) silently absorbs bot submissions.
 * - Inserts comment into database with default status 'pending'.
 */
export async function submitComment(
  values: CommentFormValues
): Promise<ActionResult> {
  const parsed = commentSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      success: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // Honeypot tripped — silent success
  if (parsed.data.companyWebsite) {
    return {
      success: true,
      message: "Thank you! Your comment has been submitted for review.",
    };
  }

  const { authorName, message, postId, projectId } = parsed.data;

  try {
    let supabase;
    try {
      supabase = await createSupabaseServerClient();
    } catch {
      supabase = createSupabaseServiceRoleClient();
    }

    const { error } = await supabase.from("comments").insert({
      author_name: authorName,
      message,
      post_id: postId || null,
      project_id: projectId || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase comment insert error:", error.message);
      // Retry with service role client if standard client fails
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { error: retryErr } = await serviceSupabase.from("comments").insert({
        author_name: authorName,
        message,
        post_id: postId || null,
        project_id: projectId || null,
        status: "pending",
      });

      if (retryErr) {
        console.error("Service role retry failed for comment:", retryErr.message);
        return {
          success: false,
          message: "Could not submit comment at this time. Please try again later.",
        };
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
    console.error("Unexpected error saving comment:", msg);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thank you! Your comment has been submitted and is awaiting approval.",
  };
}
