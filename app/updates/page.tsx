import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;


export const metadata: Metadata = {
  title: "Company Updates & Announcements",
  description: "Latest news, company announcements, and project highlights from Mountain View Concrete Cutting Inc.",
};

async function getPublishedPosts(): Promise<Post[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load posts:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Supabase client unavailable:", err);
    return [];
  }
}

export default async function UpdatesPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="cut-above bg-charcoal py-20 pb-28 text-white md:py-28 md:pb-36">
        <div className="container-page">
          <p className="eyebrow">News &amp; Information</p>
          <h1 className="mt-2 max-w-2xl text-4xl md:text-5xl">
            Company Updates &amp; Announcements
          </h1>
        </div>
      </section>

      <section className="bg-fog py-16 md:py-20">
        <div className="container-page">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-steel-light/50 bg-white py-16 px-6 text-center">
              <Newspaper size={36} className="text-steel-light mb-3" aria-hidden="true" />
              <p className="text-base text-charcoal font-medium">No announcements published yet.</p>
              <p className="mt-1 text-sm text-steel">Check back soon for the latest updates and company news.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const excerpt =
                  post.body.length > 150 ? `${post.body.slice(0, 150)}...` : post.body;
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-steel-light/20">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <time className="font-mono text-xs text-orange uppercase tracking-wider">
                          {new Date(post.created_at).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        <h2 className="mt-2 text-xl text-charcoal group-hover:text-orange transition-colors">
                          <Link href={`/updates/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-steel">{excerpt}</p>
                      </div>
                      <div className="mt-6 border-t border-steel-light/20 pt-4">
                        <Link
                          href={`/updates/${post.slug}`}
                          className="inline-flex items-center gap-1 font-display text-xs uppercase tracking-wider text-orange hover:text-orange-hover"
                        >
                          Read full update <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
