"use client";

import Link from "next/link";
import { Scissors, CircleDot, HardHat, ArrowRight } from "lucide-react";
import EditableText from "@/components/edit-mode/EditableText";

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
];

interface ServicesPreviewProps {
  isAdmin?: boolean;
  content?: {
    services_preview_title?: string;
  };
}

export default function ServicesPreview({
  isAdmin = false,
  content = {},
}: ServicesPreviewProps) {
  const title = content.services_preview_title || "OUR CORE SERVICES";

  return (
    <section className="relative bg-aggregate-deep py-20 text-chalk border-b-2 border-slurry/40">
      <div className="container-page">
        <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
          {"// WHAT WE DO"}
        </span>
        <EditableText
          contentKey="services_preview_title"
          initialValue={title}
          isAdmin={isAdmin}
          multiline={false}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, copy, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col border-2 border-slurry/50 bg-aggregate p-6 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-flame/40 bg-flame/10 text-flame mb-4">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-chalk group-hover:text-flame transition-colors">
                {title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel-light">{copy}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-tech text-xs font-bold uppercase tracking-wider text-flame">
                Learn Details
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
