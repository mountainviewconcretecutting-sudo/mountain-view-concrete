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
        <p className="border-2 border-dashed border-slurry/50 bg-aggregate-deep p-8 text-center font-body text-sm text-steel-light">
          No announcements published yet. Click &quot;Add Announcement / Post&quot; to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="border-2 border-slurry/50 bg-aggregate-deep p-5 text-chalk shadow-[3px_3px_0px_#0F1115]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 border px-2 py-0.5 font-tech text-[10px] font-bold uppercase tracking-widest ${
                        post.is_published
                          ? "border-mtnGreen bg-mtnGreen text-white"
                          : "border-slurry/60 bg-slurry/30 text-steel-light"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-chalk mt-2">{post.title}</h3>
                  <p className="font-mono text-xs text-flame">/{post.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(post)}
                    aria-label={post.is_published ? "Unpublish post" : "Publish post"}
                    title={post.is_published ? "Unpublish post" : "Publish post"}
                    className="flex h-8 w-8 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
                  >
                    {post.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(post)}
                    aria-label={`Edit ${post.title}`}
                    className="flex h-8 w-8 items-center justify-center border border-slurry/50 bg-slurry/20 text-steel-light hover:border-flame hover:text-flame transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    aria-label={`Delete ${post.title}`}
                    className="flex h-8 w-8 items-center justify-center border border-flame/40 bg-flame/10 text-flame hover:bg-flame hover:text-white transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-2 font-body text-sm text-steel-light line-clamp-2">{post.body}</p>
              <div className="mt-3 border-t border-slurry/40 pt-2 font-mono text-[11px] text-steel-light">
                {new Date(post.created_at).toLocaleDateString("en-CA")}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-none border-2 border-slurry/60 bg-aggregate-deep p-6 text-chalk shadow-[6px_6px_0px_#0F1115] max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-slurry/40 pb-3 mb-4">
              <span className="font-tech text-[10px] font-bold uppercase tracking-[0.2em] text-flame">
                {"// ANNOUNCEMENT EDITOR"}
              </span>
              <h2 className="font-display text-2xl uppercase tracking-wide text-chalk leading-tight">
                {"id" in editing ? "Edit Post" : "New Post"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Title <span className="text-flame">*</span>
                </label>
                <input
                  placeholder="Post Title"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                    URL Slug <span className="text-flame">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="flex items-center gap-1 font-tech text-xs font-bold uppercase text-flame hover:underline"
                  >
                    <Sparkles size={12} /> Auto-generate
                  </button>
                </div>
                <input
                  placeholder="url-slug"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-mono text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
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
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3 py-2 font-mono text-xs text-chalk placeholder:text-steel-light mt-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-tech text-xs font-bold uppercase tracking-wider text-chalk">
                  Body Content <span className="text-flame">*</span>
                </label>
                <textarea
                  placeholder="Write post content... Separate paragraphs with a blank line."
                  rows={6}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  className="w-full border-2 border-slurry/60 bg-aggregate px-3.5 py-2.5 font-body text-sm text-chalk placeholder:text-steel-light focus:border-flame focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-wider text-chalk cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                  className="h-4 w-4 accent-flame"
                />
                Published (visible on public site)
              </label>

              {error && <p className="border border-flame bg-flame/10 p-3 font-tech text-xs text-flame font-bold">{error}</p>}

              <div className="mt-4 flex justify-end gap-3 border-t border-slurry/40 pt-4">
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
