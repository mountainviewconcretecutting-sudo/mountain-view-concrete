"use client";

import { useState } from "react";
import { Phone, MessageSquareText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

export default function StickyCallBar() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t-2 border-slurry/60 bg-aggregate-deep md:hidden">
        <a
          href="tel:8257341419"
          className="flex items-center justify-center gap-2 py-3.5 font-display text-base uppercase tracking-wider text-chalk hover:bg-slurry/30 border-r border-slurry/40"
        >
          <Phone size={18} aria-hidden="true" className="text-flame" /> Call Now
        </a>
        <button
          type="button"
          onClick={() => setQuoteOpen(true)}
          className="flex items-center justify-center gap-2 bg-flame py-3.5 font-display text-base uppercase tracking-wider text-white hover:bg-flame-hover"
        >
          <MessageSquareText size={18} aria-hidden="true" /> Get a Quote
        </button>
      </div>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
