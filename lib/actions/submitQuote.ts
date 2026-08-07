"use server";

import { z } from "zod";
import { Resend } from "resend";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { SERVICE_TYPE_LABELS, type ActionResult, type QuoteFormValues, type ServiceType } from "@/lib/types";

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
 * Handles public Quote / Contact form submissions:
 * 1. Validates form inputs with Zod.
 * 2. Honeypot field (`companyWebsite`) silently absorbs bot submissions.
 * 3. Inserts lead record into Supabase `leads` table with status 'new' using service-role client (bypasses RLS).
 * 4. Triggers a styled HTML email notification via Resend API to mountainviewconcretecutting@gmail.com (or target env email).
 * 5. Handles DB and email errors gracefully without crashing the client interface.
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

  // Honeypot tripped — silent success for bots
  if (parsed.data.companyWebsite) {
    return { success: true, message: "Request received." };
  }

  const { name, phone, email, serviceType, projectDescription, preferredDate } =
    parsed.data;

  // 1. Database Insertion via Service-Role Client (Bypasses RLS)
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { error: dbError } = await supabase.from("leads").insert({
      name,
      phone,
      email,
      service_type: serviceType,
      project_description: projectDescription,
      preferred_date: preferredDate || null,
      status: "new",
    });

    if (dbError) {
      console.error("[submitQuote] Supabase DB insert failure:", dbError.message);
      return {
        success: false,
        message:
          "We couldn't save your request. Please call us directly at 825-734-1419.",
      };
    }
  } catch (err) {
    console.error("[submitQuote] Unexpected database exception:", err);
    return {
      success: false,
      message:
        "Something went wrong on our end. Please call us directly at 825-734-1419.",
    };
  }

  // 2. Resend HTML Email Notification Trigger (DB Insert is source of truth)
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
  serviceType: ServiceType;
  projectDescription: string;
  preferredDate?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const targetEmail =
    process.env.MOUNTAIN_VIEW_TARGET_EMAIL ||
    process.env.LEAD_NOTIFICATION_EMAIL ||
    "mountainviewconcretecutting@gmail.com";

  if (!apiKey) {
    console.warn(
      "[sendNotificationEmail] RESEND_API_KEY environment variable is missing. Email dispatch skipped."
    );
    return;
  }

  const serviceLabel = SERVICE_TYPE_LABELS[data.serviceType] || data.serviceType;
  const formattedDate = data.preferredDate
    ? new Date(data.preferredDate).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Specified";

  const plainTextContent = [
    "NEW QUOTE REQUEST - MOUNTAIN VIEW CONCRETE CUTTING",
    "--------------------------------------------------",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service Requested: ${serviceLabel}`,
    `Preferred Date: ${formattedDate}`,
    "",
    "Project Scope & Description:",
    data.projectDescription,
  ].join("\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #1E2022; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #0F172A; border-top: 6px solid #f97316; box-shadow: 4px 4px 0px #0F172A; }
          .header { background-color: #0F172A; padding: 24px; text-align: left; color: #ffffff; }
          .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; }
          .header p { margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #f97316; font-weight: bold; }
          .content { padding: 28px; }
          .badge { display: inline-block; background-color: #f97316; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; margin-bottom: 20px; letter-spacing: 1px; }
          .field-group { margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; }
          .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: bold; margin-bottom: 4px; }
          .field-value { font-size: 16px; font-weight: 600; color: #0F172A; margin: 0; }
          .field-value a { color: #f97316; text-decoration: none; }
          .description-box { background-color: #F8FAFC; border: 1px solid #CBD5E1; border-left: 4px solid #f97316; padding: 16px; margin-top: 20px; }
          .description-box p { margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
          .footer { background-color: #F1F5F9; padding: 16px 28px; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Mountain View</h1>
            <p>Concrete Cutting Inc. — Lead Notification</p>
          </div>
          <div class="content">
            <div class="badge">New Lead Received</div>
            
            <div class="field-group">
              <div class="field-label">Customer Name</div>
              <div class="field-value">${escapeHtml(data.name)}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Phone Number</div>
              <div class="field-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
            </div>

            <div class="field-group">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
            </div>

            <div class="field-group">
              <div class="field-label">Service Requested</div>
              <div class="field-value" style="color: #f97316;">${escapeHtml(serviceLabel)}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Preferred Date</div>
              <div class="field-value">${escapeHtml(formattedDate)}</div>
            </div>

            <div class="description-box">
              <div class="field-label" style="margin-bottom: 8px;">Project Details &amp; Scope</div>
              <p>${escapeHtml(data.projectDescription)}</p>
            </div>
          </div>
          <div class="footer">
            Automated notification sent to ${escapeHtml(targetEmail)} via Resend API
          </div>
        </div>
      </body>
    </html>
  `;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Mountain View Concrete Cutting <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: `New Quote Request: ${data.name} (${serviceLabel})`,
      text: plainTextContent,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[sendNotificationEmail] Resend API error:", result.error.message);
    }
  } catch (err) {
    // Failure to send email must not crash the client workflow if DB insert succeeded.
    console.error("[sendNotificationEmail] Exception during Resend dispatch:", err);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
