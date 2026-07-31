import Hero from "@/components/home/Hero";
import TrustBadges from "@/components/home/TrustBadges";
import SectorOverview from "@/components/home/SectorOverview";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedProjectsPreview from "@/components/home/FeaturedProjectsPreview";
import CtaBand from "@/components/home/CtaBand";
import { getSiteContents, getIsAdmin } from "@/lib/actions/siteContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, isAdmin] = await Promise.all([
    getSiteContents(["hero_tagline", "hero_subtext"], {
      hero_tagline: "Precision Cutting.\nSolid Results.",
      hero_subtext:
        "Concrete cutting, core drilling, and demolition for residential, commercial, and industrial projects across Calgary and Western Alberta — backed by state-of-the-art equipment and 25+ years of hands-on experience.",
    }),
    getIsAdmin(),
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
      <CtaBand />
    </>
  );
}
