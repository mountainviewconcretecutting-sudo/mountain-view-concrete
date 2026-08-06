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
    <section className="bg-aggregate py-16 md:py-24 border-b-2 border-slurry/40">
      <div className="container-page">
        <div className="flex items-center gap-2">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// SECTOR OVERVIEW"}
          </span>
        </div>
        <h2 className="mt-2 max-w-xl font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
          BUILT FOR EVERY SCALE OF PROJECT
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SECTORS.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="border-2 border-slurry/50 bg-aggregate-deep p-8 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-6">
                <Icon size={26} aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-chalk">{title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-steel">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
