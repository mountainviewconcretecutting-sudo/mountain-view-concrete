import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsSection({
  testimonials = [],
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-aggregate-deep py-20 text-chalk border-b-2 border-slurry/40">
      <div className="container-page">
        <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
          {"// CLIENT FEEDBACK"}
        </span>
        <h2 className="mt-2 max-w-xl font-display text-4xl uppercase tracking-tight text-chalk md:text-5xl">
          WHAT OUR CLIENTS SAY
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col justify-between border-2 border-slurry/50 bg-aggregate p-6 shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame"
            >
              <Quote
                size={36}
                className="absolute top-4 right-4 text-flame/20"
                aria-hidden="true"
              />

              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= t.rating
                          ? "fill-ochre text-ochre"
                          : "text-slurry/40"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="mt-4 font-body text-sm leading-relaxed italic text-steel-light">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-slurry/40 pt-4">
                <p className="font-display text-lg uppercase tracking-wide text-chalk">
                  {t.author_name}
                </p>
                {t.projects?.title && (
                  <p className="mt-0.5 font-tech text-[11px] uppercase tracking-wider text-flame">
                    Project: {t.projects.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
