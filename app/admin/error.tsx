"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin fault] Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-fog py-16 text-charcoal">
      <div className="container-page flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md rounded-sm border border-red-300 bg-white p-8 shadow-lg">
          <AlertTriangle size={48} className="mx-auto text-red-600" aria-hidden="true" />

          <h1 className="mt-4 font-display text-2xl uppercase tracking-wide text-charcoal">
            Dashboard System Error
          </h1>

          <p className="mt-2 text-sm text-steel leading-relaxed">
            An unexpected error occurred while rendering the admin dashboard. This may be due to a database connection blip or session expiration.
          </p>

          {error.digest && (
            <p className="mt-3 font-mono text-xs text-steel-light bg-fog p-2 rounded border border-steel-light/30">
              Ref ID: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-primary text-xs justify-center"
            >
              <RotateCcw size={14} aria-hidden="true" /> Reload Dashboard
            </button>

            <Link href="/" className="btn-secondary text-xs justify-center">
              <ArrowLeft size={14} aria-hidden="true" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
