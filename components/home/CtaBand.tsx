"use client";

import { useState } from "react";
import { Phone, FileText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

export default function CtaBand() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="cut-below relative bg-mtnGreen py-16 text-white md:py-20">
      <div className="container-page flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl">Ready to get the job cut, drilled, or cleared?</h2>
          <p className="mt-2 max-w-md text-white/80">
            Call now for emergency work, or send project details and we&apos;ll get back to you within one business day.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href="tel:8257341419" className="btn-primary">
            <Phone size={18} aria-hidden="true" /> Call 825-734-1419
          </a>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="btn-secondary !border-white/50 !text-white hover:!bg-white hover:!text-mtnGreen"
          >
            <FileText size={18} aria-hidden="true" /> Request a Quote
          </button>
        </div>
      </div>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  );
}
