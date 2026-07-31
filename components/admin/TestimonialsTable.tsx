"use client";

import { useTransition } from "react";
import { Star, Check, X, Clock } from "lucide-react";
import { updateTestimonialStatus } from "@/lib/actions/admin";
import type { Testimonial, TestimonialStatus } from "@/lib/types";

const STATUS_STYLES: Record<TestimonialStatus, string> = {
  pending: "bg-orange-soft text-orange-hover border-orange/30",
  approved: "bg-mtnGreen-soft text-mtnGreen border-mtnGreen/30",
  rejected: "bg-steel-light/30 text-steel border-steel-light/40",
};

export default function TestimonialsTable({
  testimonials = [],
}: {
  testimonials: Testimonial[];
}) {
  const [isPending, startTransition] = useTransition();

  if (testimonials.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-steel-light/50 bg-white p-8 text-center text-sm text-steel">
        No testimonials submitted yet. Reviews submitted from the site will appear here for moderation.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-steel-light/30 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-steel-light/30 bg-fog text-xs uppercase tracking-wide text-steel">
          <tr>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Feedback</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((item) => (
            <tr key={item.id} className="border-b border-steel-light/20 align-top last:border-0">
              <td className="px-4 py-3 font-medium text-charcoal">{item.author_name}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= item.rating
                          ? "fill-orange text-orange"
                          : "text-steel-light/30"
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs text-steel">({item.rating})</span>
                </div>
              </td>
              <td className="max-w-xs px-4 py-3 text-steel">
                <p className="line-clamp-3">{item.message}</p>
              </td>
              <td className="px-4 py-3 text-steel text-xs">
                {item.projects?.title ? item.projects.title : <span className="text-steel-light">—</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-steel text-xs">
                {new Date(item.created_at).toLocaleDateString("en-CA")}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[item.status]}`}
                >
                  {item.status === "pending" && <Clock size={12} />}
                  {item.status === "approved" && <Check size={12} />}
                  {item.status === "rejected" && <X size={12} />}
                  {item.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {item.status !== "approved" && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          updateTestimonialStatus(item.id, "approved");
                        })
                      }
                      className="flex items-center gap-1 rounded bg-mtnGreen px-2.5 py-1 text-xs font-semibold text-white hover:bg-mtnGreen-soft hover:text-mtnGreen transition-colors disabled:opacity-50"
                      title="Approve testimonial for public display"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          updateTestimonialStatus(item.id, "rejected");
                        })
                      }
                      className="flex items-center gap-1 rounded bg-steel-light/20 px-2.5 py-1 text-xs font-semibold text-steel hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      title="Reject testimonial"
                    >
                      <X size={14} /> Reject
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
