"use client";

import { useState } from "react";
import { Phone, FileText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

export default function CtaBand() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="relative border-b-4 border-flame bg-aggregate-deep py-16 text-chalk md:py-20">
      <div className="container-page flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// READY TO START"}
          </span>
          <h2 className="mt-1 font-display text-3xl uppercase tracking-tight text-chalk md:text-4xl">
            READY TO GET THE JOB CUT, DRILLED, OR CLEARED?
          </h2>
          <p className="mt-2 max-w-xl font-body text-sm text-steel-light leading-relaxed">
            Call now for emergency work, or send project details and we&apos;ll get back to you within one business day.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a href="tel:8257341419" className="btn-primary text-base font-display tracking-wider justify-center">
            <Phone size={18} aria-hidden="true" /> CALL 825-734-1419
          </a>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="btn-secondary text-base font-display tracking-wider justify-center"
          >
            <FileText size={18} aria-hidden="true" className="text-flame" /> REQUEST A QUOTE
          </button>
        </div>
      </div>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  );
}
