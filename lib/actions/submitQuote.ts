"use server";

import { z } from "zod";
import { Resend } from "resend";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { ActionResult, QuoteFormValues, ServiceType } from "@/lib/types";

const serviceTypeValues: [ServiceType, ...ServiceType[]] = [
  "wall_sawing",
  "slab_sawing",
  "core_drilling",
  "demolition_removal",
  "additional_property_services",
  "other",
];

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+\-().\s]+$/, "Use numbers, spaces, and dashes only."),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  serviceType: z.enum(serviceTypeValues, {
    errorMap: () => ({ message: "Select a service type." }),
  }),
  projectDescription: z
    .string()
    .trim()
    .min(10, "Add a few more details about the project.")
    .max(2000),
  preferredDate: z.string().optional().or(z.literal("")),
  companyWebsite: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

/**
 * Handles the public Quote / Contact form.
 * - Validates input with zod (defense in depth alongside client-side checks).
 * - Honeypot field (`companyWebsite`) silently rejects obvious bots without
 *   telling them why, so scripts can't easily detect and adapt.
 * - Inserts via the service-role client so RLS can keep `leads` unreadable
 *   from the browser while still accepting public inserts.
 * - Sends an email notification via Resend; email failure does not fail the
 *   lead capture (the database write is the source of truth).
 */
export async function submitQuote(
  values: QuoteFormValues
): Promise<ActionResult> {
  const parsed = quoteSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: ActionResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof QuoteFormValues | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      success: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // Honeypot tripped — pretend success so the bot moves on.
  if (parsed.data.companyWebsite) {
    return { success: true, message: "Request received." };
  }

  const { name, phone, email, serviceType, projectDescription, preferredDate } =
    parsed.data;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email,
      service_type: serviceType,
      project_description: projectDescription,
      preferred_date: preferredDate || null,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return {
        success: false,
        message:
          "We couldn't save your request. Please call us directly at 825-734-1419.",
      };
    }
  } catch (err) {
    console.error("Unexpected error saving lead:", err);
    return {
      success: false,
      message:
        "Something went wrong on our end. Please call us directly at 825-734-1419.",
    };
  }

  await sendNotificationEmail({
    name,
    phone,
    email,
    serviceType,
    projectDescription,
    preferredDate,
  });

  return {
    success: true,
    message: "Thanks — your request is in. We'll be in touch within one business day.",
  };
}

async function sendNotificationEmail(data: {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  projectDescription: string;
  preferredDate?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!apiKey || !notifyTo) return; // Not configured — skip silently.

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Mountain View Concrete Cutting <leads@mountainviewconcretecutting.ca>",
      to: notifyTo,
      subject: `New quote request from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Service: ${data.serviceType}`,
        `Preferred date: ${data.preferredDate || "Not specified"}`,
        "",
        "Project description:",
        data.projectDescription,
      ].join("\n"),
    });
  } catch (err) {
    // Email is a nice-to-have; the lead is already saved in the database.
    console.error("Resend email failed:", err);
  }
}
