import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-hard text-white/80">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg uppercase tracking-wide text-white">Mountain View</p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Concrete Cutting Inc.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Precision Cutting. Solid Results. 25+ years serving Calgary and Western Alberta.
          </p>
        </div>

        <nav aria-label="Footer sitemap">
          <p className="mb-3 font-display text-sm uppercase tracking-wider text-white">Company</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/about" className="hover:text-orange">About Us</Link></li>
            <li><Link href="/services" className="hover:text-orange">Services</Link></li>
            <li><Link href="/projects" className="hover:text-orange">Featured Projects</Link></li>
            <li><Link href="/contact" className="hover:text-orange">Contact</Link></li>
            <li><Link href="/admin/login" className="hover:text-orange text-white/50">Admin Portal</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 font-display text-sm uppercase tracking-wider text-white">Services</p>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            <li>Wall Sawing</li>
            <li>Slab Sawing</li>
            <li>Core Drilling (up to 22&quot;)</li>
            <li>Demolition &amp; Removal</li>
            <li>Property Maintenance</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-display text-sm uppercase tracking-wider text-white">Contact</p>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
              <a href="tel:8257341419" className="hover:text-orange">825-734-1419</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
              <a href="mailto:crafuse0@gmail.com" className="hover:text-orange">crafuse0@gmail.com</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
              <span>3904 3A Street NE, Calgary, Alberta T2E 6R4</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
              <span>24/7 Emergency Service Available</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-page text-center text-xs text-white/40">
          © {year} Mountain View Concrete Cutting Inc. (2549952 Alberta Inc.) — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
