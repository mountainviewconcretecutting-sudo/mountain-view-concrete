import { Home, Building2, Factory } from "lucide-react";

const SECTORS = [
  {
    icon: Home,
    title: "Residential",
    copy: "Basement retrofits, drainage cuts, and small-scale demolition handled cleanly and on schedule.",
  },
  {
    icon: Building2,
    title: "Commercial",
    copy: "Tenant improvements, mechanical penetrations, and structural openings for active commercial sites.",
  },
  {
    icon: Factory,
    title: "Industrial",
    copy: "Heavy wall sawing, large-diameter core drilling, and haul-away for industrial-scale projects.",
  },
];

export default function SectorOverview() {
  return (
    <section className="bg-fog py-16 md:py-24">
      <div className="container-page">
        <p className="eyebrow">Who We Work With</p>
        <h2 className="mt-2 max-w-xl text-3xl text-charcoal md:text-4xl">
          Built for every scale of project
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SECTORS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-sm border border-steel-light/30 bg-white p-7">
              <Icon size={28} className="text-orange" aria-hidden="true" />
              <h3 className="mt-4 text-xl text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
