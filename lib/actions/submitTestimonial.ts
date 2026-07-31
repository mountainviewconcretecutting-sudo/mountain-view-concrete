"use server";

import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { ActionResult, TestimonialFormValues } from "@/lib/types";

const testimonialSchema = z.object({
  authorName: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  rating: z.coerce.number().int().min(1, "Please select a rating.").max(5, "Rating must be between 1 and 5."),
  message: z.string().trim().min(10, "Please share a few more details (at least 10 characters).").max(1000, "Message is too long."),
  projectId: z.string().uuid("Invalid project selected.").optional().nullable().or(z.literal("")),
  companyWebsite: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

/**
 * Handles public Testimonial submissions from /projects page.
 * - Validates input with Zod.
 * - Honeypot field (`companyWebsite`) silently absorbs bot submissions.
 * - Inserts testimonial into database with default status 'pending'.
 */
export async function submitTestimonial(
  values: TestimonialFormValues
): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(values);

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
      message: "Thank you! Your testimonial has been submitted for review.",
    };
  }

  const { authorName, rating, message, projectId } = parsed.data;

  try {
    let supabase;
    try {
      supabase = await createSupabaseServerClient();
    } catch {
      supabase = createSupabaseServiceRoleClient();
    }

    const { error } = await supabase.from("testimonials").insert({
      author_name: authorName,
      rating,
      message,
      project_id: projectId || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase testimonial insert error:", error.message);
      // Retry with service role client if standard client fails
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { error: retryErr } = await serviceSupabase.from("testimonials").insert({
        author_name: authorName,
        rating,
        message,
        project_id: projectId || null,
        status: "pending",
      });

      if (retryErr) {
        console.error("Service role retry failed:", retryErr.message);
        return {
          success: false,
          message: "Could not submit review at this time. Please try again later.",
        };
      }
    }
  } catch (err: any) {
    console.error("Unexpected error saving testimonial:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thank you! Your review has been submitted and is awaiting admin approval.",
  };
}
