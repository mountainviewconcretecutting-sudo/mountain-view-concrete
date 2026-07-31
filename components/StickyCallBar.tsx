"use client";

import { useState } from "react";
import { Phone, MessageSquareText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

/**
 * Fixed to the bottom of the viewport on small screens only (md:hidden).
 * Keeps the two highest-intent actions — call, quote — one thumb-reach away
 * no matter how far the visitor has scrolled.
 */
export default function StickyCallBar() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-charcoal-hard bg-charcoal md:hidden">
        <a
          href="tel:8257341419"
          className="flex items-center justify-center gap-2 py-4 font-display text-sm uppercase tracking-wider text-white"
        >
          <Phone size={16} aria-hidden="true" /> Call Now
        </a>
        <button
          type="button"
          onClick={() => setQuoteOpen(true)}
          className="flex items-center justify-center gap-2 bg-orange py-4 font-display text-sm uppercase tracking-wider text-white"
        >
          <MessageSquareText size={16} aria-hidden="true" /> Get a Quote
        </button>
      </div>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
