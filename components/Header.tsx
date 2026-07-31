"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-hard bg-charcoal">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-lg font-semibold tracking-wide text-white md:text-xl">
            MOUNTAIN VIEW
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-orange sm:inline">
            Concrete Cutting
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm uppercase tracking-wider text-white/85 transition-colors hover:text-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:8257341419" className="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-charcoal">
            <Phone size={16} aria-hidden="true" /> Call Now
          </a>
          <button type="button" onClick={() => setQuoteOpen(true)} className="btn-primary">
            Request a Quote
          </button>
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-charcoal md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded px-2 py-3 font-display text-sm uppercase tracking-wider text-white/90 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 px-2 pb-2">
              <a href="tel:8257341419" className="btn-secondary !border-white/30 !text-white justify-center">
                <Phone size={16} aria-hidden="true" /> Call Now
              </a>
              <button
                type="button"
                onClick={() => {
                  setQuoteOpen(true);
                  setMenuOpen(false);
                }}
                className="btn-primary justify-center"
              >
                Request a Quote
              </button>
            </div>
          </nav>
        </div>
      )}

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </header>
  );
}
