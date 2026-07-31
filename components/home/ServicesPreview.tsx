import Link from "next/link";
import { Scissors, CircleDot, HardHat, Wrench, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: Scissors,
    title: "Wall & Slab Sawing",
    copy: "Precision cutting through reinforced walls and flat slabs, indoors or out.",
    href: "/services#cutting",
  },
  {
    icon: CircleDot,
    title: "Core Drilling",
    copy: "Clean penetrations from small conduit holes up to 22 inches in diameter.",
    href: "/services#core-drilling",
  },
  {
    icon: HardHat,
    title: "Demolition & Removal",
    copy: "Safe demolition, jackhammering, and full haul-away disposal.",
    href: "/services#demolition",
  },
  {
    icon: Wrench,
    title: "Property Services",
    copy: "Line painting, welding, snow removal, and grounds maintenance.",
    href: "/services#property-services",
  },
];

export default function ServicesPreview() {
  return (
    <section className="cut-above relative bg-charcoal py-20 text-white md:py-28">
      <div className="container-page">
        <p className="eyebrow">What We Do</p>
        <h2 className="mt-2 max-w-xl text-3xl md:text-4xl">Our Core Services</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, copy, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col rounded-sm border border-white/10 bg-white/5 p-6 transition-colors hover:border-orange/60 hover:bg-white/10"
            >
              <Icon size={26} className="text-orange" aria-hidden="true" />
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-orange">
                Learn more
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
