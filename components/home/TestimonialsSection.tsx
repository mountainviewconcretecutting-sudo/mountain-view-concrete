import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsSection({
  testimonials = [],
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) {
    return null; // Don't render section if no approved testimonials exist yet
  }

  return (
    <section className="cut-above relative bg-charcoal py-20 text-white md:py-28">
      <div className="container-page">
        <p className="eyebrow">Client Feedback</p>
        <h2 className="mt-2 max-w-xl text-3xl text-white md:text-4xl">
          What Our Clients Say
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col justify-between rounded-sm border border-white/10 bg-white/5 p-6 transition-colors hover:border-orange/40 hover:bg-white/10"
            >
              <Quote
                size={36}
                className="absolute top-4 right-4 text-orange/20"
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
                          ? "fill-orange text-orange"
                          : "text-white/20"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed italic text-white/80">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-display text-sm uppercase tracking-wide text-white">
                  {t.author_name}
                </p>
                {t.projects?.title && (
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-orange">
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
