import type { Metadata } from "next";
import EditableText from "@/components/edit-mode/EditableText";
import { getSiteContents, getIsAdmin } from "@/lib/actions/siteContent";
import { Check } from "lucide-react";

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
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// ABOUT US"}
          </span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            BUILT ON HARD WORK, RELIABILITY, AND CRAFTSMANSHIP.
          </h1>
        </div>
      </section>

      <section className="bg-aggregate py-16 md:py-24 border-b-2 border-slurry/40">
        <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]">
            <span className="font-tech text-xs font-bold uppercase tracking-widest text-flame">
              {"// COMPANY HISTORY"}
            </span>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-wide text-chalk">OUR STORY</h2>
            <div className="mt-4 font-body text-base leading-relaxed text-steel-light">
              <EditableText
                contentKey="about_story"
                initialValue={content.about_story}
                isAdmin={isAdmin}
                multiline={true}
              />
            </div>
          </div>

          <div className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]">
            <span className="font-tech text-xs font-bold uppercase tracking-widest text-flame">
              {"// OUR COMMITMENT"}
            </span>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-wide text-chalk">OUR MISSION</h2>
            <div className="mt-4 font-body text-base leading-relaxed text-steel-light">
              <EditableText
                contentKey="about_mission"
                initialValue={content.about_mission}
                isAdmin={isAdmin}
                multiline={true}
              />
            </div>
            <ul className="mt-6 flex flex-col gap-3 font-tech text-xs font-bold uppercase tracking-wider text-chalk">
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center bg-flame/10 text-flame border border-flame/40">
                  <Check size={14} />
                </span>
                25+ years of hands-on industry experience
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center bg-flame/10 text-flame border border-flame/40">
                  <Check size={14} />
                </span>
                Professional-grade cutting, drilling, and demolition equipment
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center bg-flame/10 text-flame border border-flame/40">
                  <Check size={14} />
                </span>
                Residential, commercial, and industrial project experience
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center bg-flame/10 text-flame border border-flame/40">
                  <Check size={14} />
                </span>
                Reliable, efficient service with clear communication
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center bg-ochre/10 text-ochre border border-ochre/40">
                  <Check size={14} />
                </span>
                24/7 emergency availability across Western Canada
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
