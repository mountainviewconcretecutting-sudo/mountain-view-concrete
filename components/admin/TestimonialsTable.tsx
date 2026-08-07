"use client";

import { useTransition } from "react";
import { Star, Check, X, Clock } from "lucide-react";
import { updateTestimonialStatus } from "@/lib/actions/admin";
import type { Testimonial, TestimonialStatus } from "@/lib/types";

const STATUS_STYLES: Record<TestimonialStatus, string> = {
  pending: "bg-flame text-white font-bold border-flame",
  approved: "bg-mtnGreen text-white font-bold border-mtnGreen",
  rejected: "bg-slurry/40 text-steel-light font-bold border-slurry/60",
};

export default function TestimonialsTable({
  testimonials = [],
}: {
  testimonials: Testimonial[];
}) {
  const [isPending, startTransition] = useTransition();

  if (testimonials.length === 0) {
    return (
      <p className="border-2 border-dashed border-slurry/50 bg-aggregate-deep p-8 text-center font-body text-sm text-steel-light">
        No testimonials submitted yet. Reviews submitted from the site will appear here for moderation.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b-2 border-slurry/50 bg-slurry/20 font-tech text-xs uppercase tracking-wider text-flame">
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
        <tbody className="divide-y divide-slurry/30">
          {testimonials.map((item) => (
            <tr key={item.id} className="align-top hover:bg-slurry/10 transition-colors">
              <td className="px-4 py-3.5 font-display text-base uppercase font-bold text-chalk">{item.author_name}</td>
              <td className="whitespace-nowrap px-4 py-3.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= item.rating
                          ? "fill-flame text-flame"
                          : "text-slurry/60"
                      }
                    />
                  ))}
                  <span className="ml-1 font-tech text-xs font-bold text-chalk">({item.rating})</span>
                </div>
              </td>
              <td className="max-w-xs px-4 py-3.5 font-body text-xs text-steel-light">
                <p className="line-clamp-3 leading-relaxed">{item.message}</p>
              </td>
              <td className="px-4 py-3.5 font-tech text-xs uppercase text-chalk font-bold">
                {item.projects?.title ? item.projects.title : <span className="text-steel-light">—</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-steel-light">
                {new Date(item.created_at).toLocaleDateString("en-CA")}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5">
                <span
                  className={`inline-flex items-center gap-1 border px-2.5 py-1 font-tech text-[11px] uppercase tracking-wider ${STATUS_STYLES[item.status]}`}
                >
                  {item.status === "pending" && <Clock size={12} />}
                  {item.status === "approved" && <Check size={12} />}
                  {item.status === "rejected" && <X size={12} />}
                  {item.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right">
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
                      className="flex items-center gap-1 border border-mtnGreen bg-mtnGreen px-2.5 py-1 font-tech text-xs uppercase font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
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
                      className="flex items-center gap-1 border border-slurry/60 bg-slurry/30 px-2.5 py-1 font-tech text-xs uppercase font-bold text-chalk hover:border-flame hover:text-flame transition-colors disabled:opacity-50"
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
