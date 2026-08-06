import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
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
      <section className="border-b-4 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-24">
        <div className="container-page">
          <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame">
            {"// NEWS & ANNOUNCEMENTS"}
          </span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase tracking-tight text-chalk md:text-6xl lg:text-7xl leading-none">
            COMPANY UPDATES
          </h1>
        </div>
      </section>

      <section className="bg-aggregate py-16 md:py-20 border-b-2 border-slurry/40">
        <div className="container-page">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slurry/50 bg-aggregate-deep py-16 px-6 text-center">
              <Newspaper size={40} className="text-steel mb-3" aria-hidden="true" />
              <p className="font-display text-2xl uppercase text-chalk">No announcements published yet.</p>
              <p className="mt-2 font-body text-sm text-steel-light">Check back soon for the latest updates and company news.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const excerpt =
                  post.body.length > 150 ? `${post.body.slice(0, 150)}...` : post.body;
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between border-2 border-slurry/50 bg-aggregate-deep shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115] transition-all hover:border-flame"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slurry/30 border-b-2 border-slurry/40">
                        <ImageWithFallback
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
                        <time className="font-tech text-xs text-flame uppercase tracking-widest font-bold">
                          {new Date(post.created_at).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        <h2 className="mt-2 font-display text-2xl uppercase tracking-wide text-chalk group-hover:text-flame transition-colors">
                          <Link href={`/updates/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="mt-3 font-body text-sm leading-relaxed text-steel-light">{excerpt}</p>
                      </div>
                      <div className="mt-6 border-t border-slurry/40 pt-4">
                        <Link
                          href={`/updates/${post.slug}`}
                          className="inline-flex items-center gap-1.5 font-tech text-xs font-bold uppercase tracking-wider text-flame hover:underline"
                        >
                          READ FULL UPDATE <ArrowRight size={14} aria-hidden="true" />
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
