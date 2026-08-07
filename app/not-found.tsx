import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// 404 STATUS"}
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            PAGE NOT FOUND
          </h1>
        </div>
      </section>

      <section className="bg-aggregate py-16 md:py-24 border-b-2 border-slurry/40">
        <div className="container-page text-center">
          <div className="mx-auto max-w-md border-2 border-slurry/50 bg-aggregate-deep p-8 text-chalk shadow-[6px_6px_0px_#0F1115]">
            <AlertTriangle size={52} className="mx-auto text-flame" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl uppercase tracking-wide text-chalk">
              LOCATION NOT FOUND
            </h2>
            <p className="mt-3 font-body text-sm text-steel-light leading-relaxed">
              The page you are looking for does not exist, has been removed, or moved to another URL address.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={18} aria-hidden="true" /> RETURN HOME
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
