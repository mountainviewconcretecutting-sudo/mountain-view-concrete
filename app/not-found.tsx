import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">404 Error</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">Page Not Found</h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-24">
        <div className="container-page text-center">
          <div className="mx-auto max-w-md rounded-sm border border-steel-light/30 bg-white p-8 shadow-sm">
            <AlertTriangle size={48} className="mx-auto text-orange" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl text-charcoal uppercase">
              Resource Not Found
            </h2>
            <p className="mt-2 text-sm text-steel leading-relaxed">
              The page you are looking for does not exist, has been removed, or has moved to another address.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={16} aria-hidden="true" /> Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
