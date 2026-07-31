import type { Metadata } from "next";
import { Scissors, CircleDot, HardHat, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wall sawing, slab sawing, core drilling up to 22 inches, demolition, removal, and additional property services in Calgary and Western Alberta.",
};

const PROPERTY_SERVICES = [
  "Parking lot line painting",
  "Wall painting",
  "Furnace & AC maintenance",
  "Roof maintenance",
  "Snow removal",
  "Topsoil supply",
  "Turf installation",
  "Lawn care and fertilization",
  "Sprinkler installation and repair",
  "Bollard installation",
  "Mobile welding services",
  "Security camera installation",
  "Detector loop installation",
];

const EQUIPMENT = ["Mini excavator (Mini Ho)", "Bobcat", "Dump trailer", "22-inch capacity core drills"];

export default function ServicesPage() {
  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">What We Do</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Concrete Cutting &amp; Property Services</h1>
        </div>
      </section>

      <section id="cutting" className="scroll-mt-20 bg-fog py-16 md:py-20">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2">
          <ServiceCard
            icon={Scissors}
            title="Wall Sawing"
            copy="Precision cutting through reinforced concrete walls for new openings, doorways, and mechanical penetrations — indoors or out, on active job sites."
          />
          <ServiceCard
            icon={Scissors}
            title="Slab Sawing"
            copy="High-capacity floor and flat slab sawing for retrofits, utility trenches, and structural modifications, with clean, accurate cut lines."
          />
        </div>
      </section>

      <section id="core-drilling" className="scroll-mt-20 bg-white py-16 md:py-20">
        <div className="container-page">
          <ServiceCard
            icon={CircleDot}
            title="Core Drilling"
            copy="Precision core drilling capabilities up to 22 inches in diameter, for conduit runs, plumbing penetrations, anchor bolts, and structural inspections."
          />
        </div>
      </section>

      <section id="demolition" className="scroll-mt-20 bg-fog py-16 md:py-20">
        <div className="container-page">
          <ServiceCard
            icon={HardHat}
            title="Demolition &amp; Removal"
            copy="Safe concrete demolition and jackhammering, Bobcat and mini-excavator operation, and full haul-away disposal — left clean and job-site ready."
          />
          <div className="mt-6 rounded-sm border border-steel-light/30 bg-white p-6">
            <p className="eyebrow">Equipment</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-steel sm:grid-cols-4">
              {EQUIPMENT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="property-services" className="scroll-mt-20 cut-above bg-charcoal py-16 text-white md:py-20">
        <div className="container-page">
          <div className="flex items-start gap-3">
            <Wrench size={28} className="mt-1 text-orange" aria-hidden="true" />
            <div>
              <h2 className="text-2xl md:text-3xl">Additional Property Services</h2>
              <p className="mt-2 max-w-2xl text-white/70">
                Beyond concrete, our crew handles a range of property maintenance and installation work
                for the same commercial and residential clients we cut for.
              </p>
            </div>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY_SERVICES.map((service) => (
              <li key={service} className="border-b border-white/10 pb-3">
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Scissors;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-sm border border-steel-light/30 bg-white p-7">
      <Icon size={30} className="text-orange" aria-hidden="true" />
      <h2 className="mt-4 text-2xl text-charcoal">{title}</h2>
      <p className="mt-2 leading-relaxed text-steel">{copy}</p>
    </div>
  );
}
