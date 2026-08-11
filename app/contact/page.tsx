import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactFormSection from "@/components/contact/ContactFormSection";

export const metadata: Metadata = {
  title: "Contact — Calgary & Western Alberta",
  description:
    "Call, email, or request a quote from Mountain View Concrete Cutting Inc. Serving Calgary and Western Alberta, 24/7.",
};

const SERVICE_COMMUNITIES = [
  "Calgary",
  "Airdrie",
  "Okotoks",
  "Chestermere",
  "Cochrane",
  "High River",
  "Strathmore",
  "Canmore",
  "Banff",
  "Red Deer & Region",
];

import EditableText from "@/components/edit-mode/EditableText";
import { getSiteContents, getIsAdmin } from "@/lib/actions/siteContent";

export const dynamic = "force-dynamic";

const DEFAULT_CONTACT_HEADLINE = "CONTACT US";
const DEFAULT_CONTACT_SUBTEXT = "Got a project in mind or need emergency concrete cutting services? Reach out to our team directly or send us your project details below.";

export default async function ContactPage() {
  const [content, isAdmin] = await Promise.all([
    getSiteContents(
      [
        "contact_headline",
        "contact_subtext",
        "contact_phone",
        "contact_email",
        "contact_address",
        "contact_hours",
        "contact_coverage_title",
        "contact_coverage_subtext",
      ],
      {
        contact_headline: DEFAULT_CONTACT_HEADLINE,
        contact_subtext: DEFAULT_CONTACT_SUBTEXT,
        contact_phone: "825-734-1419",
        contact_email: "crafuse0@gmail.com",
        contact_address: "3904 3A Street NE, Calgary, Alberta T2E 6R4",
        contact_hours: "24/7 Emergency Service Available",
        contact_coverage_title: "CALGARY & WESTERN ALBERTA",
        contact_coverage_subtext:
          "We dispatch mobile concrete cutting crews across Calgary and surrounding communities:",
      }
    ),
    getIsAdmin(),
  ]);

  return (
    <>
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// GET IN TOUCH"}
          </span>
          <EditableText
            contentKey="contact_headline"
            initialValue={content.contact_headline}
            isAdmin={isAdmin}
            multiline={true}
          />
          <EditableText
            contentKey="contact_subtext"
            initialValue={content.contact_subtext}
            isAdmin={isAdmin}
            multiline={true}
          />
        </div>
      </section>

      <section className="bg-aggregate py-16 md:py-20 border-b-2 border-slurry/40">
        <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2 space-y-6">
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <Phone size={24} className="mt-0.5 text-flame shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Phone</p>
                  <EditableText
                    contentKey="contact_phone"
                    initialValue={content.contact_phone}
                    isAdmin={isAdmin}
                    multiline={false}
                  />
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <Mail size={24} className="mt-0.5 text-flame shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Email</p>
                  <EditableText
                    contentKey="contact_email"
                    initialValue={content.contact_email}
                    isAdmin={isAdmin}
                    multiline={false}
                  />
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <MapPin size={24} className="mt-0.5 text-flame shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Address</p>
                  <EditableText
                    contentKey="contact_address"
                    initialValue={content.contact_address}
                    isAdmin={isAdmin}
                    multiline={true}
                  />
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <Clock size={24} className="mt-0.5 text-ochre shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Availability</p>
                  <EditableText
                    contentKey="contact_hours"
                    initialValue={content.contact_hours}
                    isAdmin={isAdmin}
                    multiline={false}
                  />
                </div>
              </li>
            </ul>

            <div className="border-2 border-slurry/50 bg-aggregate-deep p-6 shadow-[3px_3px_0px_#0F1115]">
              <span className="font-tech text-xs font-bold uppercase tracking-[0.2em] text-flame">
                {"// SERVICE COVERAGE AREA"}
              </span>
              <EditableText
                contentKey="contact_coverage_title"
                initialValue={content.contact_coverage_title}
                isAdmin={isAdmin}
                multiline={false}
              />
              <EditableText
                contentKey="contact_coverage_subtext"
                initialValue={content.contact_coverage_subtext}
                isAdmin={isAdmin}
                multiline={true}
              />
              <ul className="mt-4 grid grid-cols-2 gap-2 font-tech text-xs font-bold uppercase tracking-wider text-steel-light">
                {SERVICE_COMMUNITIES.map((city) => (
                  <li key={city} className="flex items-center gap-1.5 border border-slurry/40 bg-slurry/20 p-2">
                    <span className="text-flame">▪</span> {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <ContactFormSection />
          </div>
        </div>
      </section>
    </>
  );
}
