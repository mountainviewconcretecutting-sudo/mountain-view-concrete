import { ShieldCheck, Clock, MapPinned, Award, FileCheck2, Building2 } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "25+ Years Experience" },
  { icon: FileCheck2, label: "WCB Alberta Compliant" },
  { icon: Award, label: "COR Safety Certified" },
  { icon: Building2, label: "Fully Insured & Bonded" },
  { icon: Clock, label: "24/7 Emergency Service" },
  { icon: MapPinned, label: "Serving Calgary & Western AB" },
];

export default function TrustBadges() {
  return (
    <section className="bg-fog py-10 border-y border-steel-light/20">
      <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
        {BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mtnGreen-soft text-mtnGreen">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className="font-display text-xs uppercase tracking-wide text-charcoal">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
