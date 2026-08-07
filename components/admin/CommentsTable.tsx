"use client";

import { useTransition } from "react";
import { Check, X, Trash2, Clock, Newspaper, Briefcase } from "lucide-react";
import { updateCommentStatus, deleteComment } from "@/lib/actions/admin";
import type { Comment, CommentStatus } from "@/lib/types";

const STATUS_STYLES: Record<CommentStatus, string> = {
  pending: "bg-flame text-white font-bold border-flame",
  approved: "bg-mtnGreen text-white font-bold border-mtnGreen",
  rejected: "bg-slurry/40 text-steel-light font-bold border-slurry/60",
};

export default function CommentsTable({
  comments = [],
}: {
  comments: Comment[];
}) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) return;
    startTransition(() => {
      deleteComment(id);
    });
  }

  if (comments.length === 0) {
    return (
      <p className="border-2 border-dashed border-slurry/50 bg-aggregate-deep p-8 text-center font-body text-sm text-steel-light">
        No comments submitted yet. Comments submitted on news updates or projects will appear here for moderation.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115]">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b-2 border-slurry/50 bg-slurry/20 font-tech text-xs uppercase tracking-wider text-flame">
          <tr>
            <th className="px-4 py-3">Source / Target</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slurry/30">
          {comments.map((item) => {
            const isPost = !!item.post_id;
            const targetTitle = isPost
              ? item.posts?.title || "Post Update"
              : item.projects?.title || "Project";

            return (
              <tr key={item.id} className="align-top hover:bg-slurry/10 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 font-tech text-xs uppercase font-bold text-chalk">
                    {isPost ? (
                      <span className="inline-flex items-center gap-1 border border-flame/40 bg-flame/10 px-2 py-0.5 font-tech text-[10px] font-bold uppercase text-flame">
                        <Newspaper size={11} /> Post
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-slurry/60 bg-slurry/20 px-2 py-0.5 font-tech text-[10px] font-bold uppercase text-chalk">
                        <Briefcase size={11} /> Project
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-body text-xs font-semibold text-chalk line-clamp-1">{targetTitle}</p>
                </td>
                <td className="px-4 py-3.5 font-display text-sm uppercase font-bold text-chalk whitespace-nowrap">
                  {item.author_name}
                </td>
                <td className="max-w-xs px-4 py-3.5 font-body text-xs text-steel-light">
                  <p className="line-clamp-3 leading-relaxed">{item.message}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-steel-light">
                  {new Date(item.created_at).toLocaleDateString("en-CA")}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 border px-2.5 py-1 font-tech text-[11px] uppercase tracking-wider ${STATUS_STYLES[item.status]}`}
                  >
                    {item.status === "pending" && <Clock size={11} />}
                    {item.status === "approved" && <Check size={11} />}
                    {item.status === "rejected" && <X size={11} />}
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {item.status !== "approved" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() => {
                            updateCommentStatus(item.id, "approved");
                          })
                        }
                        className="flex items-center gap-1 border border-mtnGreen bg-mtnGreen px-2.5 py-1 font-tech text-xs uppercase font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        title="Approve comment"
                      >
                        <Check size={13} /> Approve
                      </button>
                    )}

                    {item.status !== "rejected" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() => {
                            updateCommentStatus(item.id, "rejected");
                          })
                        }
                        className="flex items-center gap-1 border border-slurry/60 bg-slurry/30 px-2.5 py-1 font-tech text-xs uppercase font-bold text-chalk hover:border-flame hover:text-flame transition-colors disabled:opacity-50"
                        title="Reject comment"
                      >
                        <X size={13} /> Reject
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(item.id)}
                      className="flex h-7 w-7 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
