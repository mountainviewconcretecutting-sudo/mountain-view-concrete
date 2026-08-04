"use client";

import { useTransition } from "react";
import { Check, X, Trash2, Clock, Newspaper, Briefcase } from "lucide-react";
import { updateCommentStatus, deleteComment } from "@/lib/actions/admin";
import type { Comment, CommentStatus } from "@/lib/types";

const STATUS_STYLES: Record<CommentStatus, string> = {
  pending: "bg-orange-soft text-orange-hover border-orange/30",
  approved: "bg-mtnGreen-soft text-mtnGreen border-mtnGreen/30",
  rejected: "bg-steel-light/30 text-steel border-steel-light/40",
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
      <p className="rounded-sm border border-dashed border-steel-light/50 bg-white p-8 text-center text-sm text-steel">
        No comments submitted yet. Comments submitted on news updates or projects will appear here for moderation.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-steel-light/30 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-steel-light/30 bg-fog text-xs uppercase tracking-wide text-steel">
          <tr>
            <th className="px-4 py-3">Source / Target</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((item) => {
            const isPost = !!item.post_id;
            const targetTitle = isPost
              ? item.posts?.title || "Post Update"
              : item.projects?.title || "Project";

            return (
              <tr key={item.id} className="border-b border-steel-light/20 align-top last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-charcoal">
                    {isPost ? (
                      <span className="inline-flex items-center gap-1 rounded bg-orange-soft px-1.5 py-0.5 text-[10px] font-mono uppercase text-orange-hover">
                        <Newspaper size={11} /> Post
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-fog border border-steel-light/30 px-1.5 py-0.5 text-[10px] font-mono uppercase text-steel">
                        <Briefcase size={11} /> Project
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-charcoal font-medium line-clamp-1">{targetTitle}</p>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal text-xs whitespace-nowrap">
                  {item.author_name}
                </td>
                <td className="max-w-xs px-4 py-3 text-steel text-xs">
                  <p className="line-clamp-3">{item.message}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-steel text-xs font-mono">
                  {new Date(item.created_at).toLocaleDateString("en-CA")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${STATUS_STYLES[item.status]}`}
                  >
                    {item.status === "pending" && <Clock size={11} />}
                    {item.status === "approved" && <Check size={11} />}
                    {item.status === "rejected" && <X size={11} />}
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
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
                        className="flex items-center gap-1 rounded bg-mtnGreen px-2 py-1 text-xs font-semibold text-white hover:bg-mtnGreen-soft hover:text-mtnGreen transition-colors disabled:opacity-50"
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
                        className="flex items-center gap-1 rounded bg-steel-light/20 px-2 py-1 text-xs font-semibold text-steel hover:bg-orange hover:text-white transition-colors disabled:opacity-50"
                        title="Reject comment"
                      >
                        <X size={13} /> Reject
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(item.id)}
                      className="rounded p-1 text-steel hover:bg-orange-soft hover:text-orange-hover transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      <Trash2 size={15} />
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
