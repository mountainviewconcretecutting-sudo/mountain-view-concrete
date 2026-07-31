"use client";

import { useState } from "react";
import { Phone, FileText } from "lucide-react";
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
    <section className="cut-above relative overflow-hidden bg-charcoal pb-28 pt-16 text-white md:pb-40 md:pt-24">
      {/* Signature moment: a blade of light sweeps across on load, echoing a
          saw blade tracing its first cut — the one animated flourish on the
          page. Respects prefers-reduced-motion via globals.css. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden opacity-70" aria-hidden="true">
        <div className="blade-line h-full animate-sawCut" />
      </div>

      <div className="container-page relative">
        <p className="eyebrow animate-revealUp [animation-delay:0.1s] opacity-0">
          Calgary &amp; Western Alberta · Est. 25+ Years
        </p>

        <EditableText
          contentKey="hero_tagline"
          initialValue={tagline}
          isAdmin={isAdmin}
          multiline={true}
        />

        <EditableText
          contentKey="hero_subtext"
          initialValue={subtext}
          isAdmin={isAdmin}
          multiline={true}
        />

        <div className="mt-9 flex animate-revealUp flex-col gap-3 opacity-0 [animation-delay:0.55s] sm:flex-row">
          <a href="tel:8257341419" className="btn-primary">
            <Phone size={18} aria-hidden="true" /> Call Now: 825-734-1419
          </a>
          <button type="button" onClick={() => setQuoteOpen(true)} className="btn-secondary !border-white/40 !text-white hover:!bg-white hover:!text-charcoal">
            <FileText size={18} aria-hidden="true" /> Request a Quote
          </button>
        </div>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  );
}
