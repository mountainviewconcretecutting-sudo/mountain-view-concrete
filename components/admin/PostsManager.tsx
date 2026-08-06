"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Sparkles, Eye, EyeOff } from "lucide-react";
import { upsertPost, deletePost } from "@/lib/actions/admin";
import type { Post } from "@/lib/types";
import { slugify } from "@/lib/utils/slugify";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

const EMPTY: Omit<Post, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  body: "",
  cover_image_url: "",
  is_published: false,
};

export default function PostsManager({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<Post | (typeof EMPTY) | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const result = await upsertPost(editing as Post);
    setSaving(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await deletePost(id);
  }

  async function handleTogglePublish(post: Post) {
    await upsertPost({
      ...post,
      is_published: !post.is_published,
    });
  }

  function generateSlug() {
    if (editing && editing.title) {
      setEditing({ ...editing, slug: slugify(editing.title) });
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-secondary">
          <Plus size={16} aria-hidden="true" /> Add Announcement / Post
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-sm border border-dashed border-steel-light/50 bg-white p-8 text-center text-sm text-steel">
          No announcements published yet. Click &quot;Add Announcement / Post&quot; to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-sm border border-steel-light/30 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                        post.is_published
                          ? "bg-mtnGreen-soft text-mtnGreen font-semibold"
                          : "bg-steel-light/20 text-steel"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-charcoal">{post.title}</h3>
                  <p className="font-mono text-xs text-steel-light">/{post.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(post)}
                    aria-label={post.is_published ? "Unpublish post" : "Publish post"}
                    title={post.is_published ? "Unpublish post" : "Publish post"}
                    className="rounded p-1.5 text-steel hover:bg-fog hover:text-charcoal"
                  >
                    {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(post)}
                    aria-label={`Edit ${post.title}`}
                    className="rounded p-1.5 text-steel hover:bg-fog hover:text-charcoal"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    aria-label={`Delete ${post.title}`}
                    className="rounded p-1.5 text-steel hover:bg-orange-soft hover:text-orange-hover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-steel line-clamp-2">{post.body}</p>
              <div className="mt-3 border-t border-steel-light/20 pt-2 text-[11px] text-steel-light font-mono">
                {new Date(post.created_at).toLocaleDateString("en-CA")}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-hard/70 p-4">
          <div className="w-full max-w-lg rounded-sm bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg uppercase text-charcoal">
              {"id" in editing ? "Edit Post" : "New Post"}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
                  Title
                </label>
                <input
                  placeholder="Post Title"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-steel">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="flex items-center gap-1 text-[11px] text-orange hover:underline font-mono"
                  >
                    <Sparkles size={12} /> Auto-generate
                  </button>
                </div>
                <input
                  placeholder="url-slug"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm font-mono"
                />
              </div>

              <div>
                <ImageDropzone
                  currentUrl={editing.cover_image_url || ""}
                  onUploadSuccess={(url) => setEditing({ ...editing, cover_image_url: url })}
                  label="Cover Image (Drag & Drop to Upload)"
                />
                <input
                  placeholder="Or enter Image URL manually"
                  value={editing.cover_image_url || ""}
                  onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm font-mono text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-steel mb-1">
                  Body Content
                </label>
                <textarea
                  placeholder="Write post content... Separate paragraphs with a blank line."
                  rows={6}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  className="w-full rounded-sm border border-steel-light/50 px-3 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                Published (visible on public site)
              </label>

              {error && <p className="text-sm font-medium text-orange-hover">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-70">
                  {saving ? "Saving..." : "Save Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
