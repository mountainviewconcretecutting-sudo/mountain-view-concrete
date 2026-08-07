"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalLayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[critical fault] Global layout exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#111316] text-[#F1F3F5] font-sans antialiased min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md border-2 border-[#FF5500] bg-[#1B1E22] p-8 text-center shadow-[6px_6px_0px_#0F1115]">
          <AlertOctagon size={48} className="mx-auto text-[#FF5500] mb-4" />
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white">
            CRITICAL SYSTEM ERROR
          </h1>
          <p className="mt-3 text-sm text-[#CBD1D9] leading-relaxed">
            A critical application error occurred. Click below to attempt a system reset.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 bg-[#FF5500] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_#0F1115] hover:bg-[#E04B00]"
            >
              <RotateCcw size={16} /> RESET APPLICATION
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
