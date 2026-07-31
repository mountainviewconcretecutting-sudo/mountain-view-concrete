// ---------------------------------------------------------------------------
// Domain types shared across client & server components.
// Mirrors the Supabase schema in /supabase/schema.sql — keep in sync.
// ---------------------------------------------------------------------------

export type ServiceType =
  | "wall_sawing"
  | "slab_sawing"
  | "core_drilling"
  | "demolition_removal"
  | "additional_property_services"
  | "other";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  wall_sawing: "Wall Sawing",
  slab_sawing: "Slab Sawing",
  core_drilling: "Core Drilling",
  demolition_removal: "Demolition & Removal",
  additional_property_services: "Additional Property Services",
  other: "Other / Not Sure",
};

export type ProjectCategory = "residential" | "commercial" | "industrial";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  service_type: ServiceType;
  summary: string;
  image_url: string;
  location: string | null;
  completed_on: string | null; // ISO date
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service_type: ServiceType;
  project_description: string;
  preferred_date: string | null; // ISO date
  status: LeadStatus;
  created_at: string;
}

export interface QuoteFormValues {
  name: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  projectDescription: string;
  preferredDate: string;
  // Honeypot field — must stay empty. Bots that fill every input will trip it.
  companyWebsite: string;
}

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  id: string;
  author_name: string;
  rating: number; // 1-5
  message: string;
  project_id: string | null;
  status: TestimonialStatus;
  created_at: string;
  projects?: { title: string } | null;
}

export interface TestimonialFormValues {
  authorName: string;
  rating: number;
  message: string;
  projectId?: string | null;
  // Honeypot field — must stay empty.
  companyWebsite?: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string>;
}
