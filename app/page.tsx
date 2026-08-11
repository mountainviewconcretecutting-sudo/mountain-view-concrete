import Hero from "@/components/home/Hero";
import TrustBadges from "@/components/home/TrustBadges";
import SectorOverview from "@/components/home/SectorOverview";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedProjectsPreview from "@/components/home/FeaturedProjectsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaBand from "@/components/home/CtaBand";
import { getSiteContents, getIsAdmin } from "@/lib/actions/siteContent";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*, projects(title)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) return [];
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [content, isAdmin, testimonials] = await Promise.all([
    getSiteContents(
      [
        "hero_tagline",
        "hero_subtext",
        "sector_title",
        "sector_res_copy",
        "sector_com_copy",
        "sector_ind_copy",
        "cta_title",
        "cta_subtext",
        "services_preview_title",
        "projects_preview_title",
      ],
      {
        hero_tagline: "Precision Cutting.\nSolid Results.",
        hero_subtext:
          "Concrete cutting, core drilling, and demolition for residential, commercial, and industrial projects across Calgary and Western Alberta — backed by state-of-the-art equipment and 25+ years of hands-on experience.",
        sector_title: "BUILT FOR EVERY SCALE OF PROJECT",
        sector_res_copy:
          "Basement retrofits, drainage cuts, and small-scale demolition handled cleanly and on schedule.",
        sector_com_copy:
          "Tenant improvements, mechanical penetrations, and structural openings for active commercial sites.",
        sector_ind_copy:
          "Heavy wall sawing, large-diameter core drilling, and haul-away for industrial-scale projects.",
        cta_title: "READY TO GET THE JOB CUT, DRILLED, OR CLEARED?",
        cta_subtext:
          "Call now for emergency work, or send project details and we'll get back to you within one business day.",
        services_preview_title: "OUR CORE SERVICES",
        projects_preview_title: "FEATURED PROJECTS",
      }
    ),
    getIsAdmin(),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      <Hero
        tagline={content.hero_tagline}
        subtext={content.hero_subtext}
        isAdmin={isAdmin}
      />
      <TrustBadges />
      <SectorOverview isAdmin={isAdmin} content={content} />
      <ServicesPreview isAdmin={isAdmin} content={content} />
      <FeaturedProjectsPreview isAdmin={isAdmin} content={content} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBand isAdmin={isAdmin} content={content} />
    </>
  );
}
