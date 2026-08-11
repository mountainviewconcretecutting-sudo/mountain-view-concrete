"use client";

import { useState } from "react";
import { Phone, FileText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";
import EditableText from "@/components/edit-mode/EditableText";

interface CtaBandProps {
  isAdmin?: boolean;
  content?: {
    cta_title?: string;
    cta_subtext?: string;
  };
}

export default function CtaBand({
  isAdmin = false,
  content = {},
}: CtaBandProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const title = content.cta_title || "READY TO GET THE JOB CUT, DRILLED, OR CLEARED?";
  const subtext = content.cta_subtext || "Call now for emergency work, or send project details and we'll get back to you within one business day.";

  return (
    <section className="relative border-b-4 border-flame bg-aggregate-deep py-16 text-chalk md:py-20">
      <div className="container-page flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// READY TO START"}
          </span>
          <EditableText
            contentKey="cta_title"
            initialValue={title}
            isAdmin={isAdmin}
            multiline={false}
          />
          <EditableText
            contentKey="cta_subtext"
            initialValue={subtext}
            isAdmin={isAdmin}
            multiline={true}
          />
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
