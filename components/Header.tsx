"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, FileText } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/updates", label: "Updates" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-slurry/50 bg-aggregate-deep/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
          <Image alt="Mountain View Concrete Cutting Inc. Logo" className="h-10 w-auto md:h-12" height={60} priority src="/images/main-logo.png" width={240}/>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-tech text-xs uppercase tracking-widest text-steel-light transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:8257341419"
            className="btn-secondary !py-2.5 !px-4 text-xs font-tech tracking-wider border-steel/40 text-chalk hover:border-flame"
          >
            <Phone size={14} aria-hidden="true" className="text-flame" /> 825-734-1419
          </a>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="btn-primary !py-2.5 !px-5 text-sm font-display tracking-wider"
          >
            <FileText size={16} aria-hidden="true" /> Request a Quote
          </button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-slurry/60 bg-slurry/30 text-chalk md:hidden focus-visible:ring-2 focus-visible:ring-flame"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t-2 border-slurry/50 bg-aggregate-deep md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-slurry/20 px-3 py-3 font-tech text-sm uppercase tracking-widest text-chalk hover:bg-slurry/20 hover:text-flame"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 px-1">
              <a
                href="tel:8257341419"
                className="btn-secondary justify-center text-sm font-tech tracking-widest"
              >
                <Phone size={16} aria-hidden="true" className="text-flame" /> Call 825-734-1419
              </a>
              <button
                type="button"
                onClick={() => {
                  setQuoteOpen(true);
                  setMenuOpen(false);
                }}
                className="btn-primary justify-center text-base"
              >
                <FileText size={18} aria-hidden="true" /> Request a Quote
              </button>
            </div>
          </nav>
        </div>
      )}

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </header>
  );
}
