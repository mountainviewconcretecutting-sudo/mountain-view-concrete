import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactFormSection from "@/components/contact/ContactFormSection";

export const metadata: Metadata = {
  title: "Contact",
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

export default function ContactPage() {
  return (
    <>
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// GET IN TOUCH"}
          </span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            CONTACT US
          </h1>
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
                  <a href="tel:8257341419" className="font-body text-base text-steel-light hover:text-flame transition-colors font-bold">
                    825-734-1419
                  </a>
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <Mail size={24} className="mt-0.5 text-flame shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Email</p>
                  <a href="mailto:crafuse0@gmail.com" className="font-body text-base text-steel-light hover:text-flame transition-colors font-bold">
                    crafuse0@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <MapPin size={24} className="mt-0.5 text-flame shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Address</p>
                  <p className="font-body text-sm text-steel-light">3904 3A Street NE, Calgary, Alberta T2E 6R4</p>
                </div>
              </li>
              <li className="flex gap-4 border-2 border-slurry/50 bg-aggregate-deep p-5 shadow-[3px_3px_0px_#0F1115]">
                <Clock size={24} className="mt-0.5 text-ochre shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">Availability</p>
                  <p className="font-tech text-sm text-ochre font-bold">24/7 Emergency Service Available</p>
                </div>
              </li>
            </ul>

            <div className="border-2 border-slurry/50 bg-aggregate-deep p-6 shadow-[3px_3px_0px_#0F1115]">
              <span className="font-tech text-xs font-bold uppercase tracking-[0.2em] text-flame">
                {"// SERVICE COVERAGE AREA"}
              </span>
              <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-chalk">CALGARY &amp; WESTERN ALBERTA</h3>
              <p className="mt-2 font-body text-xs text-steel-light leading-relaxed">
                We dispatch mobile concrete cutting crews across Calgary and surrounding communities:
              </p>
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
