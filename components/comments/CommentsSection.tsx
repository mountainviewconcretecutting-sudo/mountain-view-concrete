"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitComment } from "@/lib/actions/submitComment";
import type { Comment } from "@/lib/types";

interface CommentsSectionProps {
  postId?: string;
  projectId?: string;
  comments: Comment[];
  title?: string;
}

export default function CommentsSection({
  postId,
  projectId,
  comments = [],
  title = "Discussion & Comments",
}: CommentsSectionProps) {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
    fieldErrors?: Record<string, string>;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const res = await submitComment({
      authorName,
      message,
      postId,
      projectId,
      companyWebsite,
    });

    setSubmitting(false);

    if (res.success) {
      setStatus({ type: "success", message: res.message });
      setAuthorName("");
      setMessage("");
      setCompanyWebsite("");
    } else {
      setStatus({
        type: "error",
        message: res.message,
        fieldErrors: res.fieldErrors,
      });
    }
  }

  return (
    <div className="mt-10 border-t border-steel-light/20 pt-8">
      <div className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-charcoal">
        <MessageSquare size={20} className="text-orange" aria-hidden="true" />
        <h2>{title} ({comments.length})</h2>
      </div>

      {/* Approved Comments List */}
      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="rounded-sm border border-dashed border-steel-light/40 bg-fog/50 p-6 text-center text-sm text-steel">
            No comments yet. Be the first to share your thoughts or ask a question!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-sm border border-steel-light/30 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm text-charcoal">
                  {comment.author_name}
                </span>
                <time className="font-mono text-[11px] text-steel-light">
                  {new Date(comment.created_at).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-steel whitespace-pre-line">
                {comment.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Leave a Comment Form */}
      <div className="mt-8 rounded-sm border border-steel-light/30 bg-fog p-6">
        <h3 className="font-display text-sm uppercase tracking-wider text-charcoal">
          Leave a Comment
        </h3>
        <p className="mt-1 text-xs text-steel">
          Your comment will be published after review by our team.
        </p>

        {status?.type === "success" && (
          <div className="mt-4 flex items-start gap-2.5 rounded-sm border border-mtnGreen/30 bg-mtnGreen-soft p-3.5 text-sm text-mtnGreen">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p>{status.message}</p>
          </div>
        )}

        {status?.type === "error" && (
          <div className="mt-4 flex items-start gap-2.5 rounded-sm border border-orange/30 bg-orange-soft p-3.5 text-sm text-orange-hover">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Honeypot field (hidden from legitimate users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`companyWebsite-${postId || projectId}`}>Company Website</label>
            <input
              type="text"
              id={`companyWebsite-${postId || projectId}`}
              name="companyWebsite"
              tabIndex={-1}
              autoComplete="off"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
              Your Name <span className="text-orange">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded-sm border border-steel-light/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-orange focus:outline-none"
            />
            {status?.fieldErrors?.authorName && (
              <p className="mt-1 text-xs text-orange">{status.fieldErrors.authorName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
              Comment / Message <span className="text-orange">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Share your experience or inquiry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-sm border border-steel-light/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-orange focus:outline-none"
            />
            {status?.fieldErrors?.message && (
              <p className="mt-1 text-xs text-orange">{status.fieldErrors.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2 text-xs py-2 px-4 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={14} /> Submit Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
