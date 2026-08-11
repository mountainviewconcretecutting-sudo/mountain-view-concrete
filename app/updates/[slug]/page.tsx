import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CommentsSection from "@/components/comments/CommentsSection";
import type { Post, Comment } from "@/lib/types";

export const revalidate = 60;


interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Post;
  } catch (err) {
    console.error("Failed to fetch post by slug:", err);
    return null;
  }
}

async function getApprovedCommentsForPost(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as Comment[];
  } catch (err) {
    console.error("Failed to fetch comments for post:", err);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  const raw = post.body.replace(/\n/g, " ");
  const description =
    raw.length <= 155
      ? raw
      : raw.slice(0, 155).replace(/\s+\S*$/, "") + "...";
  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | Mountain View Concrete Cutting Inc.`,
      description,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getApprovedCommentsForPost(post.id);
  const paragraphs = post.body.split("\n\n").filter(Boolean);

  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <Link
            href="/updates"
            className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-orange hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to all updates
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-orange uppercase tracking-wider">
            <Calendar size={14} aria-hidden="true" />
            <span>
              {new Date(post.created_at).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page max-w-4xl">
          <article className="rounded-sm border border-steel-light/30 bg-white p-6 md:p-10 shadow-sm">
            {post.cover_image_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-steel-light/20 mb-8">
                <ImageWithFallback
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 896px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-5 text-base md:text-lg leading-relaxed text-steel">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-steel-light/20 pt-6">
              <Link
                href="/updates"
                className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-orange hover:text-orange-hover"
              >
                <ArrowLeft size={14} aria-hidden="true" /> All updates
              </Link>
              <Link href="/contact" className="btn-primary px-4 py-2 text-xs">
                Request a Quote
              </Link>
            </div>

            <CommentsSection postId={post.id} comments={comments} />
          </article>
        </div>
      </section>
    </>
  );
}
