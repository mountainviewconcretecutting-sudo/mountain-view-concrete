"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, Phone } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected production runtime errors to error reporting / console
    console.error("[system fault] App runtime exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-aggregate py-16 text-chalk md:py-24">
      <div className="container-page flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-lg border-2 border-flame/60 bg-aggregate-deep p-8 shadow-[6px_6px_0px_#0F1115]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-flame/40 bg-flame/10 text-flame mb-4">
            <AlertOctagon size={36} aria-hidden="true" />
          </div>

          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// SYSTEM FAULT — 500 ERROR"}
          </span>

          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-chalk md:text-5xl">
            OPERATION TEMPORARILY PAUSED
          </h1>

          <p className="mt-4 font-body text-sm text-steel-light leading-relaxed">
            An unexpected application error occurred while processing your request. Our system safety guards have caught the issue.
          </p>

          {error.digest && (
            <p className="mt-3 font-tech text-[11px] uppercase tracking-wider text-steel bg-slurry/20 p-2 border border-slurry/40 font-mono">
              Error Digest: {error.digest}
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-primary w-full sm:w-auto text-sm justify-center"
            >
              <RotateCcw size={16} aria-hidden="true" /> RETRY OPERATION
            </button>

            <Link href="/" className="btn-secondary w-full sm:w-auto text-sm justify-center">
              <Home size={16} aria-hidden="true" /> RETURN HOME
            </Link>
          </div>

          <div className="mt-8 border-t border-slurry/40 pt-4 text-xs font-tech text-steel-light">
            Need urgent concrete cutting service?{" "}
            <a href="tel:8257341419" className="font-bold text-flame underline inline-flex items-center gap-1 ml-1">
              <Phone size={12} /> Call 825-734-1419
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
