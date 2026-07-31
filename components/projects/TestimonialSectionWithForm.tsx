"use client";

import { useState } from "react";
import { Star, MessageSquarePlus, Quote } from "lucide-react";
import TestimonialFormModal from "./TestimonialFormModal";
import type { Project, Testimonial } from "@/lib/types";

export default function TestimonialSectionWithForm({
  projects = [],
  testimonials = [],
}: {
  projects: Project[];
  testimonials: Testimonial[];
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="bg-white py-16 md:py-24 border-t border-steel-light/20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Client Feedback</p>
            <h2 className="mt-2 text-3xl text-charcoal md:text-4xl">
              Project Reviews &amp; Testimonials
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-primary"
          >
            <MessageSquarePlus size={18} aria-hidden="true" />
            Leave a Review
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="mt-10 rounded-sm border border-dashed border-steel-light/50 bg-fog p-10 text-center">
            <p className="text-sm text-steel">
              Have you worked with us? Be the first to share your experience with Mountain View Concrete Cutting Inc.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-secondary mt-4"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="relative flex flex-col justify-between rounded-sm border border-steel-light/30 bg-fog p-6 shadow-sm"
              >
                <Quote
                  size={32}
                  className="absolute top-4 right-4 text-orange/15"
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
                            : "text-steel-light/30"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed italic text-steel">
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>

                <div className="mt-6 border-t border-steel-light/20 pt-4">
                  <p className="font-display text-sm uppercase tracking-wide text-charcoal">
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
        )}
      </div>

      <TestimonialFormModal
        projects={projects}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
