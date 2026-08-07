"use server";

import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { ActionResult, TestimonialFormValues } from "@/lib/types";

/**
 * Returns true only for genuine transport/connectivity failures.
 * Postgres errors (RLS violations, constraint failures, etc.) and any other
 * database-level rejection must NOT trigger a service-role retry because that
 * would silently bypass RLS for non-network reasons.
 */
function isConnectionError(error: unknown): boolean {
  let msg = "";
  if (error instanceof Error) {
    msg = error.message;
  } else if (error !== null && typeof error === "object" && "message" in error) {
    msg = String((error as { message: unknown }).message);
  }
  const m = msg.toLowerCase();
  return (
    m.includes("fetch failed") ||
    m.includes("failed to fetch") ||
    m.includes("econnrefused") ||
    m.includes("etimedout") ||
    m.includes("socket hang up") ||
    m.includes("network error") ||
    (m.includes("connection") && !m.includes("policy"))
  );
}

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
    } catch (err) {
      if (isConnectionError(err)) {
        supabase = createSupabaseServiceRoleClient();
      } else {
        throw err;
      }
    }

    const { error } = await supabase.from("testimonials").insert({
      author_name: authorName,
      rating,
      message,
      project_id: projectId || null,
      status: "pending",
    });

    if (error && isConnectionError(error)) {
      console.error("Supabase connection error (testimonial):", error.message);
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { error: retryErr } = await serviceSupabase.from("testimonials").insert({
        author_name: authorName,
        rating,
        message,
        project_id: projectId || null,
        status: "pending",
      });

      if (retryErr) {
        console.error("Service role retry failed (testimonial):", retryErr.message);
        return {
          success: false,
          message: "Could not submit review at this time. Please try again later.",
        };
      }
    } else if (error) {
      console.error("Supabase testimonial insert error:", error.message);
      return {
        success: false,
        message: "Could not submit review at this time. Please try again later.",
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
    console.error("Unexpected error saving testimonial:", msg);
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
