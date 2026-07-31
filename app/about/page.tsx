import type { Metadata } from "next";
import EditableText from "@/components/edit-mode/EditableText";
import { getSiteContents, getIsAdmin } from "@/lib/actions/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "25+ years of concrete cutting expertise in Calgary and Western Alberta.",
};

const DEFAULT_STORY =
  "Mountain View Concrete Cutting Inc. (2549952 Alberta Inc.) was established more than 25 years ago in Western Alberta. What started as a small crew with a handful of saws has grown into a trusted contractor serving residential, commercial, and industrial clients across Calgary and the surrounding region.\n\nWe've built our reputation the same way for two and a half decades: showing up on time, cutting it right the first time, and communicating clearly from quote to cleanup.";

const DEFAULT_MISSION =
  "To deliver safe, precise, and dependable concrete cutting, drilling, and removal services using state-of-the-art equipment and proven techniques — so every job is completed efficiently and to the highest industry standard.";

export default async function AboutPage() {
  const [content, isAdmin] = await Promise.all([
    getSiteContents(["about_story", "about_mission"], {
      about_story: DEFAULT_STORY,
      about_mission: DEFAULT_MISSION,
    }),
    getIsAdmin(),
  ]);

  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">About Us</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">
            Built on hard work, reliability, and craftsmanship.
          </h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl text-charcoal">Our Story</h2>
            <EditableText
              contentKey="about_story"
              initialValue={content.about_story}
              isAdmin={isAdmin}
              multiline={true}
            />
          </div>
          <div>
            <h2 className="text-2xl text-charcoal">Our Mission</h2>
            <EditableText
              contentKey="about_mission"
              initialValue={content.about_mission}
              isAdmin={isAdmin}
              multiline={true}
            />
            <ul className="mt-6 flex flex-col gap-3 text-sm text-charcoal">
              <li className="flex gap-2"><span className="text-orange">✔</span> 25+ years of hands-on industry experience</li>
              <li className="flex gap-2"><span className="text-orange">✔</span> Professional-grade cutting, drilling, and demolition equipment</li>
              <li className="flex gap-2"><span className="text-orange">✔</span> Residential, commercial, and industrial project experience</li>
              <li className="flex gap-2"><span className="text-orange">✔</span> Reliable, efficient service with clear communication</li>
              <li className="flex gap-2"><span className="text-orange">✔</span> 24/7 emergency availability</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
