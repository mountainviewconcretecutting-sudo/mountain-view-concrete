"use client";

import { useState } from "react";
import { Phone, FileText, ShieldCheck, Zap } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";
import EditableText from "@/components/edit-mode/EditableText";

interface HeroProps {
  tagline: string;
  subtext: string;
  isAdmin: boolean;
}

export default function Hero({
  tagline = "Precision Cutting.\nSolid Results.",
  subtext = "Concrete cutting, core drilling, and demolition for residential, commercial, and industrial projects across Calgary and Western Alberta — backed by state-of-the-art equipment and 25+ years of hands-on experience.",
  isAdmin = false,
}: HeroProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="relative overflow-hidden border-b-4 border-slurry/40 bg-aggregate-deep pb-20 pt-12 text-chalk md:pb-28 md:pt-20">
      {/* Background industrial Grid pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9BA3AF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container-page relative z-10">
        <div className="inline-flex items-center gap-2 border border-slurry/50 bg-slurry/20 px-3 py-1 text-xs font-tech font-bold uppercase tracking-widest text-ochre mb-6">
          <Zap size={14} className="text-flame" />
          <span>{"// CALGARY & WESTERN ALBERTA . EST. 25+ YEARS"}</span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-chalk sm:text-6xl md:text-7xl lg:text-8xl leading-none">
            <EditableText
              contentKey="hero_tagline"
              initialValue={tagline}
              isAdmin={isAdmin}
              multiline={true}
            />
          </h1>

          <div className="mt-6 max-w-2xl font-body text-base text-steel-light sm:text-lg md:text-xl leading-relaxed">
            <EditableText
              contentKey="hero_subtext"
              initialValue={subtext}
              isAdmin={isAdmin}
              multiline={true}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="tel:8257341419"
            className="btn-primary text-lg font-display tracking-wider sm:w-auto w-full justify-center"
          >
            <Phone size={20} aria-hidden="true" /> CALL NOW: 825-734-1419
          </a>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="btn-secondary text-lg font-display tracking-wider sm:w-auto w-full justify-center"
          >
            <FileText size={20} aria-hidden="true" className="text-flame" /> REQUEST A QUOTE
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-slurry/30 pt-6 text-xs font-tech uppercase tracking-wider text-steel-light">
          <span className="flex items-center gap-1.5 text-ochre font-bold">
            <ShieldCheck size={16} /> COR Safety Certified
          </span>
          <span className="text-slurry">|</span>
          <span>WCB Alberta Compliant</span>
          <span className="text-slurry">|</span>
          <span>Fully Insured &amp; Bonded</span>
          <span className="text-slurry">|</span>
          <span className="text-flame font-bold">24/7 Emergency Service</span>
        </div>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  );
}
