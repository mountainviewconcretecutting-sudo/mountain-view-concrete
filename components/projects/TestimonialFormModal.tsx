"use client";

import { useState, useTransition } from "react";
import { Star, X, Loader2, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { submitTestimonial } from "@/lib/actions/submitTestimonial";
import type { Project, TestimonialFormValues } from "@/lib/types";

interface TestimonialFormModalProps {
  projects?: Project[];
  open: boolean;
  onClose: () => void;
}

export default function TestimonialFormModal({
  projects = [],
  open,
  onClose,
}: TestimonialFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState(""); // Honeypot
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const values: TestimonialFormValues = {
      authorName,
      rating,
      message,
      projectId: projectId || null,
      companyWebsite,
    };

    startTransition(async () => {
      const res = await submitTestimonial(values);
      if (res.success) {
        setSuccess(true);
      } else {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
        setServerError(res.message);
      }
    });
  };

  const handleResetAndClose = () => {
    setAuthorName("");
    setRating(5);
    setMessage("");
    setProjectId("");
    setCompanyWebsite("");
    setFieldErrors({});
    setServerError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-hard/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-sm border border-steel-light/30 bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-steel hover:text-charcoal transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mtnGreen-soft text-mtnGreen">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-charcoal">
              Thank You!
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-steel">
              Your testimonial has been submitted successfully and is awaiting admin review. We appreciate your feedback!
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="btn-primary mt-6 w-full"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="text-orange" size={24} aria-hidden="true" />
              <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">
                Leave a Testimonial
              </h2>
            </div>
            <p className="mt-1 text-xs text-steel">
              Share your experience working with Mountain View Concrete Cutting Inc.
            </p>

            {serverError && (
              <div className="mt-4 rounded-sm border border-orange/30 bg-orange-soft p-3 text-xs text-orange-hover">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-display uppercase tracking-wide text-charcoal">
                  Rating <span className="text-orange">*</span>
                </label>
                <div className="mt-1.5 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={26}
                        className={
                          star <= (hoverRating ?? rating)
                            ? "fill-orange text-orange"
                            : "text-steel-light/40"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-xs text-steel">
                    ({rating} / 5 stars)
                  </span>
                </div>
                {fieldErrors.rating && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.rating}</p>
                )}
              </div>

              {/* Author Name */}
              <div>
                <label htmlFor="authorName" className="block text-xs font-display uppercase tracking-wide text-charcoal">
                  Your Name / Company <span className="text-orange">*</span>
                </label>
                <input
                  id="authorName"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. John Doe, ABC Construction"
                  className="mt-1 w-full rounded-sm border border-steel-light/50 bg-fog p-2.5 text-charcoal placeholder-steel-light focus:border-orange focus:bg-white focus:outline-none"
                />
                {fieldErrors.authorName && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.authorName}</p>
                )}
              </div>

              {/* Optional Project Select */}
              {projects.length > 0 && (
                <div>
                  <label htmlFor="projectId" className="block text-xs font-display uppercase tracking-wide text-charcoal">
                    Associated Project <span className="text-steel-light font-normal">(Optional)</span>
                  </label>
                  <select
                    id="projectId"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1 w-full rounded-sm border border-steel-light/50 bg-fog p-2.5 text-charcoal focus:border-orange focus:bg-white focus:outline-none"
                  >
                    <option value="">-- General Review (No Specific Project) --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="testimonialMessage" className="block text-xs font-display uppercase tracking-wide text-charcoal">
                  Your Feedback / Review <span className="text-orange">*</span>
                </label>
                <textarea
                  id="testimonialMessage"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the concrete cutting, core drilling, or demolition job..."
                  className="mt-1 w-full rounded-sm border border-steel-light/50 bg-fog p-2.5 text-charcoal placeholder-steel-light focus:border-orange focus:bg-white focus:outline-none"
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
                )}
              </div>

              {/* Honeypot field (hidden from real users) */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="companyWebsite">Website</label>
                <input
                  id="companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Review for Approval"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
