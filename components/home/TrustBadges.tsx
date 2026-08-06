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
    <section className="border-y-2 border-slurry/40 bg-aggregate py-8">
      <div className="container-page grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 border border-slurry/30 bg-slurry/20 p-3 shadow-[2px_2px_0px_#0F1115]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ochre/40 bg-ochre/10 text-ochre">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
