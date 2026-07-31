import { ShieldCheck, Wrench, Clock, MapPinned } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "25+ Years Experience" },
  { icon: Clock, label: "24/7 Emergency Service" },
  { icon: Wrench, label: "Professional Grade Equipment" },
  { icon: MapPinned, label: "Serving Calgary & Western AB" },
];

export default function TrustBadges() {
  return (
    <section className="bg-fog py-10 md:py-12">
      <div className="container-page grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
        {BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mtnGreen-soft text-mtnGreen">
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="font-display text-xs uppercase tracking-wide text-charcoal md:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
