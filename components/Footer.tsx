import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-slurry/60 bg-aggregate-deep text-steel-light">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href="/">
            <Image alt="Mountain View Concrete Cutting Inc. Logo" className="h-10 w-auto md:h-12 mb-4" height={60} src="/images/main-logo.png" width={240}/>
          </Link>
          <p className="mt-4 font-body text-sm leading-relaxed text-steel-light">
            Precision Cutting. Solid Results. 25+ years serving Calgary and Western Alberta.
          </p>
        </div>

        <nav aria-label="Footer sitemap">
          <p className="mb-3 font-tech text-xs font-bold uppercase tracking-widest text-chalk border-b border-slurry/30 pb-1">Company</p>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li><Link href="/about" className="hover:text-flame transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-flame transition-colors">Services</Link></li>
            <li><Link href="/projects" className="hover:text-flame transition-colors">Featured Projects</Link></li>
            <li><Link href="/updates" className="hover:text-flame transition-colors">Announcements</Link></li>
            <li><Link href="/contact" className="hover:text-flame transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-flame transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-flame transition-colors">Terms of Service</Link></li>
            <li><Link href="/admin" className="hover:text-flame text-steel/60 transition-colors">Admin Portal</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 font-tech text-xs font-bold uppercase tracking-widest text-chalk border-b border-slurry/30 pb-1">Services</p>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li><Link href="/services#wall-sawing" className="hover:text-flame transition-colors">Wall Sawing</Link></li>
            <li><Link href="/services#slab-sawing" className="hover:text-flame transition-colors">Slab Sawing</Link></li>
            <li><Link href="/services#core-drilling" className="hover:text-flame transition-colors">Core Drilling (up to 22&quot;)</Link></li>
            <li><Link href="/services#demolition-removal" className="hover:text-flame transition-colors">Demolition &amp; Removal</Link></li>
            <li><Link href="/services#property-services" className="hover:text-flame transition-colors">Property Maintenance</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-tech text-xs font-bold uppercase tracking-widest text-chalk border-b border-slurry/30 pb-1">Contact</p>
          <ul className="flex flex-col gap-3 font-body text-sm text-steel-light">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-flame" aria-hidden="true" />
              <a href="tel:8257341419" className="hover:text-flame transition-colors">825-734-1419</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-flame" aria-hidden="true" />
              <a href="mailto:crafuse0@gmail.com" className="hover:text-flame transition-colors">crafuse0@gmail.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-flame" aria-hidden="true" />
              <span>3904 3A Street NE, Calgary, Alberta T2E 6R4</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-ochre" aria-hidden="true" />
              <span className="text-ochre font-bold">24/7 Emergency Service Available</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slurry/30 py-5">
        <p className="container-page text-center font-tech text-xs text-steel">
          © {year} Mountain View Concrete Cutting Inc. (2549952 Alberta Inc.) — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
