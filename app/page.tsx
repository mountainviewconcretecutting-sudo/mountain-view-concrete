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
    getSiteContents(["hero_tagline", "hero_subtext"], {
      hero_tagline: "Precision Cutting.\nSolid Results.",
      hero_subtext:
        "Concrete cutting, core drilling, and demolition for residential, commercial, and industrial projects across Calgary and Western Alberta — backed by state-of-the-art equipment and 25+ years of hands-on experience.",
    }),
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
      <SectorOverview />
      <ServicesPreview />
      <FeaturedProjectsPreview />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBand />
    </>
  );
}
