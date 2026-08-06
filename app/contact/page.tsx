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
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">Get In Touch</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Contact Us</h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <ul className="flex flex-col gap-6">
              <li className="flex gap-3">
                <Phone size={22} className="mt-0.5 text-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm uppercase tracking-wide text-charcoal">Phone</p>
                  <a href="tel:8257341419" className="text-steel hover:text-orange">
                    825-734-1419
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={22} className="mt-0.5 text-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm uppercase tracking-wide text-charcoal">Email</p>
                  <a href="mailto:crafuse0@gmail.com" className="text-steel hover:text-orange">
                    crafuse0@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin size={22} className="mt-0.5 text-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm uppercase tracking-wide text-charcoal">Address</p>
                  <p className="text-steel">3904 3A Street NE, Calgary, Alberta T2E 6R4</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={22} className="mt-0.5 text-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm uppercase tracking-wide text-charcoal">Availability</p>
                  <p className="text-steel">24/7 Emergency Service Available</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-sm border border-steel-light/30 bg-white p-6">
              <p className="eyebrow">Service Coverage Area</p>
              <h3 className="mt-1 text-base font-medium text-charcoal">Calgary &amp; Western Alberta</h3>
              <p className="mt-2 text-xs text-steel leading-relaxed">
                We dispatch mobile concrete cutting crews across Calgary and surrounding communities:
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-steel font-mono">
                {SERVICE_COMMUNITIES.map((city) => (
                  <li key={city} className="flex items-center gap-1">
                    <span className="text-orange">▪</span> {city}
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
